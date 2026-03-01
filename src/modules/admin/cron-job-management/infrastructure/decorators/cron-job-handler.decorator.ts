import { SetMetadata } from '@nestjs/common'

import { CronJobKey } from '../../domain/enums/cron-job-key.enum'

export const CRON_JOB_HANDLER_KEY = 'cron-job-handler-key'
export const CronJobHandler = (key: CronJobKey) =>
  SetMetadata(CRON_JOB_HANDLER_KEY, key)
