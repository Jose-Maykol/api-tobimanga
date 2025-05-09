import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
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
    }

    const job = new CronJob(cronJob.getSchedule().getValue(), () => {
      this.executeTask(cronJob.getTask())
    })

    this.schedulerRegistry.addCronJob(jobId, job)
    job.start()

    console.log(`Scheduled job ${jobId} (${taskCommand}) at ${cronExpression}`)
  }

  private async executeTask(task: CronTask) {
    try {
      const commandClass = CronTaskRegistry.getCommandClass(task.getValue())
      const command = new commandClass()
      await this.commandBus.execute(command)
      console.log(`Executed task: ${task.getValue()} successfully`)
    } catch (error) {
      console.error(`Error executing task ${task.getValue()}:`, error)
    }
  }

  async unscheduleJob(jobId: string) {
    if (this.schedulerRegistry.doesExist('cron', jobId)) {
      this.schedulerRegistry.deleteCronJob(jobId)
      console.log(`Unscheduled job ${jobId}`)
      return true
    }
    return false
  }

  async rescheduleJob(jobId: string, newSchedule: CronSchedule) {
    const job = await this.repository.findById(jobId)
    if (!job) throw new Error('Job not found')

    await this.unscheduleJob(jobId)
    job.update({ schedule: newSchedule })
    await this.repository.save(job)
    await this.scheduleJob(job)
  }

  private async initializeScheduledJobs() {
    const jobs = await this.repository.findAllActive()
    jobs.forEach((job) => this.scheduleJob(job))
  }
}
