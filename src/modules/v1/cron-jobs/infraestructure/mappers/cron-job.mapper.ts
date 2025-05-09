import { CronJob } from '../../domain/entities/cron-job.entity'
import { CronSchedule } from '../../domain/value-objects/cron-schedule.value-object'
import { CronTask } from '../../domain/value-objects/cron-task.value-object'

export class CronJobMapper {
  static toDomain(cronJob: any): any {
    return new CronJob(
      cronJob.id,
      cronJob.name,
      new CronSchedule(cronJob.schedule),
      new CronTask(cronJob.task),
      cronJob.isActive,
      cronJob.createdAt,
      cronJob.updatedAt,
    )
  }

  static toPersistence(cronJob: CronJob): any {
    return {
      id: cronJob.getId(),
      name: cronJob.getName(),
      schedule: cronJob.getSchedule().getValue(),
      task: cronJob.getTask().getValue(),
      isActive: cronJob.getIsActive(),
      createdAt: cronJob.getCreatedAt(),
      updatedAt: cronJob.getUpdatedAt(),
    }
  }

  static toDomainList(cronJobs: any[]): CronJob[] {
    return cronJobs.map((cronJob) => this.toDomain(cronJob))
  }

  static toPersistenceList(cronJobs: CronJob[]): any[] {
    return cronJobs.map((cronJob) => this.toPersistence(cronJob))
  }
}
