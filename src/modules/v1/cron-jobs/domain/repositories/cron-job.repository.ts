import { CronJob } from '../entities/cron-job.entity'

export interface CronJobRepository {
  save(cronJob: CronJob): Promise<void>
  findAllActive(): Promise<CronJob[]>
  findById(id: string): Promise<CronJob | null>
}
