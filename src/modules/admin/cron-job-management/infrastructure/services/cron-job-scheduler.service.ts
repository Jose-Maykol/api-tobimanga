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

  /**
   * Initializes the module by discovering handlers and loading active jobs from the database.
   * Part of the NestJS OnModuleInit lifecycle hook.
   */
  async onModuleInit() {
    this.discoverHandlers()
    await this.loadActiveJobs()
  }

  /**
   * Scans all application providers to find those decorated with @CronJobHandler.
   * Registers found handlers in the internal map for later execution.
   * @private
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
   * Loads all active cron jobs from the database and registers them in the SchedulerRegistry.
   * Executed on application startup to restore previous scheduler state.
   * @private
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
   * Registers a new cron job in the NestJS SchedulerRegistry.
   * Starts the job immediately after registration.
   * @param key Unique identifier key for the cron job.
   * @param schedule Standard cron expression defined for the frequency.
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
   * Safely removes a cron job from the scheduler registry if it is currently registered.
   * @param key Unique identifier key of the cron job to remove.
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
   * Triggers a job's execution manually, bypassing its defined schedule.
   * Creates an initial execution record and starts the job in the background.
   * @param key Unique identifier key for the cron job.
   * @returns The unique ID of the created execution record.
   * @throws {Error} If cron job is not found or is deactivated.
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
   * Stops an ongoing job execution.
   * If the execution is active in memory, sends an abort signal to the handler.
   * If it's a "zombie" execution (not in memory), it marks it as CANCELLED in the database.
   * @param executionId Unique ID of the execution record to stop.
   */
  async stopJobExecution(executionId: string): Promise<void> {
    const controller = this.activeExecutions.get(executionId)
    if (controller) {
      controller.abort()
      this.logger.log(`Sent abort signal to execution: ${executionId}`)
    } else {
      this.logger.warn(
        `No active execution found with ID: ${executionId}. It might be a zombie execution. Marking as cancelled.`,
      )
      await this.cronJobExecutionRepository.update(executionId, {
        status: CronJobExecutionStatus.CANCELLED,
        finishedAt: new Date(),
        errorMessage: 'Ejecución cancelada manualmente (ejecución huérfana)',
      })
    }
  }

  /**
   * Logic for handling an automated cron job trigger.
   * Validates job status and creates an execution record before running the handler.
   * @param key Unique identifier key for the cron job.
   * @private
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
   * Orchestrates the full lifecycle of a job execution: record updates, AbortSignal management,
   * duration tracking, and logging.
   * @param key Unique identifier key for the cron job.
   * @param executionId Unique ID of the execution record.
   * @param options Additional options/parameters for the job handler.
   * @private
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
   * Dispatches the actual business logic by finding the appropriate handler.
   * @param key Unique identifier key for the cron job.
   * @param options Options to pass to the handler.
   * @param signal AbortSignal to allow task cancellation.
   * @private
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
