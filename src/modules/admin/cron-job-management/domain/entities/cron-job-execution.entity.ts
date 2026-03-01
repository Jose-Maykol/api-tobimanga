import { CronJobExecutionStatus } from '../enums/cron-job-execution-status.enum'

export interface CronJobExecution {
  id: string
  cronJobId: string
  status: CronJobExecutionStatus
  startedAt: Date
  finishedAt: Date | null
  durationMs: number | null
  errorMessage: string | null
}
