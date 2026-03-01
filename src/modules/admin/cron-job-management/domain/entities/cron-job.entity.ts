import { CronJobKey } from '../enums/cron-job-key.enum'

export interface CronJob {
  id: string
  key: CronJobKey
  name: string
  description: string | null
  schedule: string
  options: Record<string, unknown>
  isActive: boolean
  lastRunAt: Date | null
  nextRunAt: Date | null
  createdAt: Date
  updatedAt: Date | null
}
