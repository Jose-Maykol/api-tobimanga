import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-codes'

export class CronJobDeactivatedException extends BaseException {
  constructor(name: string) {
    super(
      `El cron job "${name}" se encuentra desactivado y no puede ser ejecutado manualmente`,
      ErrorCodes.CRON_JOB_DEACTIVATED,
    )
  }
}
