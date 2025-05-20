import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'
import { CronJob as CronJobEntity } from '../../domain/entities/cron-job.entity'
import { CronJobRepository } from '../../domain/repositories/cron-job.repository'
import { CommandBus } from '@nestjs/cqrs'
import { CronTaskRegistry } from '../../domain/cron-tasks.registry'
import { CronTask } from '../../domain/value-objects/cron-task.value-object'
import { CronSchedule } from '../../domain/value-objects/cron-schedule.value-object'

@Injectable()
export class CronSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(CronSchedulerService.name)

  constructor(
    private readonly commandBus: CommandBus,
    private readonly schedulerRegistry: SchedulerRegistry,
    @Inject('CronJobRepository')
    private readonly repository: CronJobRepository,
  ) {}

  async onModuleInit() {
    await this.initializeScheduledJobs()
  }

  async scheduleJob(cronJob: CronJobEntity) {
    const jobId = cronJob.getId()
    const cronExpression = cronJob.getSchedule().getValue()
    const taskCommand = cronJob.getTask().getValue()

    if (this.schedulerRegistry.doesExist('cron', jobId)) {
      this.schedulerRegistry.deleteCronJob(jobId)
      this.logger.log({
        message: 'Removed existing cron job',
        jobId,
        cronExpression,
      })
    }

    const job = new CronJob(cronExpression, async () => {
      const startTime = new Date()
      this.logger.log({
        message: 'Starting cron task',
        jobId,
        taskCommand,
        cronExpression,
      })

      try {
        await this.executeTask(cronJob.getTask())
        const endTime = new Date()
        this.logger.log({
          message: 'Cron task completed',
          jobId,
          taskCommand,
          durationMs: startTime.getTime() - endTime.getTime(),
        })
      } catch (error) {
        const errorTime = new Date()
        this.logger.error(
          {
            message: 'Cron task failed',
            jobId,
            taskCommand,
            durationMs: errorTime.getTime() - startTime.getTime(),
            error: error.message,
          },
          error.stack,
        )
      }
    })

    this.schedulerRegistry.addCronJob(jobId, job)
    job.start()

    this.logger.log({
      message: 'Scheduled new cron job',
      jobId,
      cronExpression,
    })
  }

  private async executeTask(task: CronTask) {
    const taskName = task.getValue()
    try {
      const commandClass = CronTaskRegistry.getCommandClass(taskName)
      const command = new commandClass()

      this.logger.debug({
        message: 'Dispatching command',
        taskName,
        command: command.constructor.name,
      })

      await this.commandBus.execute(command)

      this.logger.log({
        message: 'Command executed successfully',
        taskName,
        command: command.constructor.name,
      })
    } catch (error) {
      this.logger.error(
        {
          message: 'Error executing command',
          taskName,
          error: error.message,
        },
        error.stack,
      )
      throw error
    }
  }

  async unscheduleJob(jobId: string): Promise<boolean> {
    if (this.schedulerRegistry.doesExist('cron', jobId)) {
      this.schedulerRegistry.deleteCronJob(jobId)
      this.logger.log({
        message: 'Unscheduling cron job',
        jobId,
      })
      return true
    }
    return false
  }

  async rescheduleJob(jobId: string, newSchedule: CronSchedule) {
    this.logger.log({
      message: 'Rescheduling cron job',
      jobId,
      newSchedule: newSchedule.getValue(),
    })

    const job = await this.repository.findById(jobId)
    if (!job) {
      this.logger.error({
        message: 'Cron job not found for rescheduling',
        jobId,
      })
      throw new Error('Cron job not found')
    }

    await this.unscheduleJob(jobId)
    job.update({ schedule: newSchedule })
    await this.repository.save(job)
    await this.scheduleJob(job)

    this.logger.log({
      message: 'Cron job rescheduled successfully',
      jobId,
      newSchedule: newSchedule.getValue(),
    })
  }

  private async initializeScheduledJobs() {
    const jobs = await this.repository.findAllActive()
    jobs.forEach((job) => this.scheduleJob(job))
  }
}
