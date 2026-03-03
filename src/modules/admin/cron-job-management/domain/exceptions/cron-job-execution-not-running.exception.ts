import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-codes'

export class CronJobExecutionNotRunningException extends BaseException {
  constructor(status: string) {
    super(
      `La ejecución no está en estado RUNNING (estado actual: ${status})`,
      ErrorCodes.CRON_JOB_EXECUTION_NOT_RUNNING,
    )
  }
}
