import { CronJob } from '../entities/cron-job.entity'
import { CronJobKey } from '../enums/cron-job-key.enum'

export interface CronJobRepository {
  findAll(): Promise<CronJob[]>
  findById(id: string): Promise<CronJob | null>
  findByKey(key: CronJobKey): Promise<CronJob | null>
  findAllActive(): Promise<CronJob[]>
  save(cronJob: CronJob): Promise<CronJob>
  update(id: string, cronJob: Partial<CronJob>): Promise<CronJob | null>
  delete(id: string): Promise<boolean>
}
