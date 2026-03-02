import { CronJob as CronJobInstance } from 'cron'
import { v4 as uuidv4 } from 'uuid'

import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { DiscoveryService, MetadataScanner } from '@nestjs/core'
import { SchedulerRegistry } from '@nestjs/schedule'

import { CronJobExecution } from '../../domain/entities/cron-job-execution.entity'
import { CronJobExecutionStatus } from '../../domain/enums/cron-job-execution-status.enum'
import { CronJobKey } from '../../domain/enums/cron-job-key.enum'
import { ICronJobHandler } from '../../domain/interfaces/cron-job-handler.interface'
import { CronJobRepository } from '../../domain/repositories/cron-job.repository'
import { CronJobExecutionRepository } from '../../domain/repositories/cron-job-execution.repository'
import {
  CRON_JOB_EXECUTION_REPOSITORY,
  CRON_JOB_REPOSITORY,
} from '../../domain/tokens'
import { CRON_JOB_HANDLER_KEY } from '../decorators/cron-job-handler.decorator'

@Injectable()
export class CronJobSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(CronJobSchedulerService.name)
  private readonly handlers = new Map<string, ICronJobHandler>()
  private readonly activeExecutions = new Map<string, AbortController>()

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    @Inject(CRON_JOB_REPOSITORY)
    private readonly cronJobRepository: CronJobRepository,
    @Inject(CRON_JOB_EXECUTION_REPOSITORY)
    private readonly cronJobExecutionRepository: CronJobExecutionRepository,
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  async onModuleInit() {
    this.discoverHandlers()
    await this.loadActiveJobs()
  }

  /**
   * Scans all application providers to find those decorated with @CronJobHandler
   * and registers them in the handlers map.
   */
  private discoverHandlers() {
    const providers = this.discoveryService.getProviders()

    for (const wrapper of providers) {
      if (!wrapper.isDependencyTreeStatic() || !wrapper.instance) {
        continue
      }

      const instance = wrapper.instance
      const prototype = Object.getPrototypeOf(instance)

      if (!prototype) {
        continue
      }

      const key = Reflect.getMetadata(
        CRON_JOB_HANDLER_KEY,
        instance.constructor,
      )

      if (key) {
        this.handlers.set(key, instance as ICronJobHandler)
        this.logger.log(`Registered cron job handler for key "${key}"`)
      }
    }
  }

  /**
   * Loads all active cron jobs from the database and registers them
   * in the scheduler registry on application startup.
   */
  private async loadActiveJobs() {
    const activeJobs = await this.cronJobRepository.findAllActive()
    this.logger.log(
      `Loading ${activeJobs.length} active cron job(s) from database`,
    )

    for (const job of activeJobs) {
      this.registerCronJob(job.key, job.schedule)
    }
  }

  /**
   * Registers a cron job in the NestJS SchedulerRegistry.
   * The actual job handler creates an execution record and logs the result.
   */
  registerCronJob(key: CronJobKey, schedule: string) {
    try {
      // Remove existing if present
      this.removeCronJobIfExists(key)

      const cronJob = new CronJobInstance(schedule, async () => {
        await this.handleJobExecution(key)
      })

      this.schedulerRegistry.addCronJob(key, cronJob)
      cronJob.start()

      this.logger.log(
        `Cron job "${key}" registered with schedule "${schedule}"`,
      )
    } catch (error) {
      this.logger.error(
        `Failed to register cron job "${key}": ${error.message}`,
      )
    }
  }

  /**
   * Removes a cron job from the scheduler registry if it exists.
   */
  removeCronJobIfExists(key: CronJobKey) {
    try {
      if (this.schedulerRegistry.doesExist('cron', key)) {
        this.schedulerRegistry.deleteCronJob(key)
        this.logger.log(`Cron job "${key}" removed from scheduler`)
      }
    } catch {
      // Job doesn't exist, no-op
    }
  }

  /**
   * Triggers a job manually bypassing its schedule.
   * Returns the execution ID for tracking.
   */
  async executeJobManually(key: CronJobKey): Promise<string> {
    const cronJob = await this.cronJobRepository.findByKey(key)
    if (!cronJob) {
      throw new Error(`Cron job "${key}" not found in database.`)
    }

    if (!cronJob.isActive) {
      throw new Error(
        `El cron job "${cronJob.name}" se encuentra desactivado y no puede ser ejecutado.`,
      )
    }

    const execution: CronJobExecution = {
      id: uuidv4(),
      cronJobId: cronJob.id,
      status: CronJobExecutionStatus.RUNNING,
      startedAt: new Date(),
      finishedAt: null,
      durationMs: null,
      errorMessage: null,
    }
    await this.cronJobExecutionRepository.save(execution)

    // Run in background without awaiting
    this.handleJobExecutionWithRecord(key, execution.id, cronJob.options).catch(
      (err) => {
        this.logger.error(`Manual execution failed: ${err.message}`, err.stack)
      },
    )

    return execution.id
  }

  /**
   * Stops an ongoing execution by sending an abort signal.
   */
  async stopJobExecution(executionId: string): Promise<void> {
    const controller = this.activeExecutions.get(executionId)
    if (controller) {
      controller.abort()
      this.logger.log(`Sent abort signal to execution: ${executionId}`)
    } else {
      this.logger.warn(`No active execution found with ID: ${executionId}`)
      throw new Error(`La ejecución ${executionId} no está activa o no existe.`)
    }
  }

  /**
   * Handles the execution of a cron job by its key.
   */
  private async handleJobExecution(key: CronJobKey) {
    const cronJob = await this.cronJobRepository.findByKey(key)
    if (!cronJob) {
      this.logger.warn(
        `Cron job "${key}" triggered but not found in database. Removing from scheduler.`,
      )
      this.removeCronJobIfExists(key)
      return
    }

    if (!cronJob.isActive) {
      this.logger.warn(
        `Cron job "${key}" triggered but it is deactivated in database. Removing from scheduler.`,
      )
      this.removeCronJobIfExists(key)
      return
    }

    const executionId = crypto.randomUUID()

    const execution: CronJobExecution = {
      id: executionId,
      cronJobId: cronJob.id,
      status: CronJobExecutionStatus.RUNNING,
      startedAt: new Date(),
      finishedAt: null,
      durationMs: null,
      errorMessage: null,
    }

    await this.cronJobExecutionRepository.save(execution)
    await this.handleJobExecutionWithRecord(key, executionId, cronJob.options)
  }

  /**
   * Core logic to run a job, properly handling AbortController and status updates.
   */
  private async handleJobExecutionWithRecord(
    key: CronJobKey,
    executionId: string,
    options: Record<string, unknown>,
  ) {
    const startTime = Date.now()
    const abortController = new AbortController()

    this.activeExecutions.set(executionId, abortController)

    try {
      this.logger.log(
        `Executing cron job "${key}" (Execution ID: ${executionId})...`,
      )

      await this.executeJobByKey(key, options, abortController.signal)

      const durationMs = Date.now() - startTime

      await this.cronJobExecutionRepository.update(executionId, {
        status: CronJobExecutionStatus.COMPLETED,
        finishedAt: new Date(),
        durationMs,
      })

      const cronJob = await this.cronJobRepository.findByKey(key)
      if (cronJob) {
        await this.cronJobRepository.update(cronJob.id, {
          lastRunAt: new Date(),
        })
      }

      this.logger.log(
        `Cron job "${key}" completed successfully in ${durationMs}ms`,
      )
    } catch (error) {
      const durationMs = Date.now() - startTime
      const isManualCancellation =
        error.message === 'Ejecución cancelada manualmente'

      await this.cronJobExecutionRepository.update(executionId, {
        status: isManualCancellation
          ? CronJobExecutionStatus.CANCELLED
          : CronJobExecutionStatus.FAILED,
        finishedAt: new Date(),
        durationMs,
        errorMessage: error.message || 'Unknown error',
      })

      const cronJob = await this.cronJobRepository.findByKey(key)
      if (cronJob) {
        await this.cronJobRepository.update(cronJob.id, {
          lastRunAt: new Date(),
        })
      }

      if (isManualCancellation) {
        this.logger.warn(
          `Cron job "${key}" execution (${executionId}) was manually canceled after ${durationMs}ms`,
        )
      } else {
        this.logger.error(
          `Cron job "${key}" failed after ${durationMs}ms: ${error.message}`,
        )
      }
    } finally {
      this.activeExecutions.delete(executionId)
    }
  }

  /**
   * Dispatches the actual job logic based on the job key.
   */
  private async executeJobByKey(
    key: string,
    options: Record<string, unknown>,
    signal?: AbortSignal,
  ): Promise<void> {
    const handler = this.handlers.get(key)

    if (handler) {
      await handler.execute(options, signal)
    } else {
      this.logger.warn(
        `No handler registered for cron job key "${key}". Options: ${JSON.stringify(options)}`,
      )
    }
  }
}
