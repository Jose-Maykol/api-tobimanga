import { CronJobExecution } from '../entities/cron-job-execution.entity'

export interface CronJobExecutionRepository {
  findById(id: string): Promise<CronJobExecution | null>
  findByCronJobId(
    cronJobId: string,
    page?: number,
    limit?: number,
  ): Promise<CronJobExecution[]>
  countByCronJobId(cronJobId: string): Promise<number>
  save(execution: CronJobExecution): Promise<CronJobExecution>
  update(
    id: string,
    execution: Partial<CronJobExecution>,
  ): Promise<CronJobExecution | null>
}
