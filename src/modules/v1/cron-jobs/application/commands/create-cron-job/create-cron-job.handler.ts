import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateCronJobCommand } from './create-cron-job.command'
import { CronJobRepository } from '../../../domain/repositories/cron-job.repository'
import { v4 as uuidv4 } from 'uuid'
import { CronJob } from '../../../domain/entities/cron-job.entity'
import { CronSchedule } from '../../../domain/value-objects/cron-schedule.value-object'
import { CronSchedulerService } from '../../services/cron-scheduler.service'
import { CronTaskRegistry } from '../../../domain/cron-tasks.registry'
import { Inject } from '@nestjs/common'
import { CronTask } from '../../../domain/value-objects/cron-task.value-object'

@CommandHandler(CreateCronJobCommand)
export class CreateCronJobHandler
  implements ICommandHandler<CreateCronJobCommand>
{
  constructor(
    @Inject('CronJobRepository')
    private repository: CronJobRepository,
    private scheduler: CronSchedulerService,
    @Inject('CRON_TASK_REGISTRY')
    private readonly registry: CronTaskRegistry,
  ) {}

  async execute(command: CreateCronJobCommand) {
    const { name, schedule, task, isActive } = command.cron
    const cronJob = new CronJob(
      uuidv4(),
      name,
      new CronSchedule(schedule),
      new CronTask(task),
      isActive,
      new Date(),
      new Date(),
    )

    await this.repository.save(cronJob)
    await this.scheduler.scheduleJob(cronJob)

    return {
      message: 'Cron job created successfully',
      cronJob: {
        id: cronJob.getId(),
      },
    }
  }
}
