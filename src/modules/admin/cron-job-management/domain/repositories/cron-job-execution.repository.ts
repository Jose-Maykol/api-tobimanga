import { CronJobExecution } from '../entities/cron-job-execution.entity'

export interface CronJobExecutionRepository {
  findByCronJobId(
    cronJobId: string,
    limit?: number,
  ): Promise<CronJobExecution[]>
  save(execution: CronJobExecution): Promise<CronJobExecution>
  update(
    id: string,
    execution: Partial<CronJobExecution>,
  ): Promise<CronJobExecution | null>
}
