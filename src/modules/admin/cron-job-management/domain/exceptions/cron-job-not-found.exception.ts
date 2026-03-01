import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-codes'

export class CronJobNotFoundException extends BaseException {
  constructor(id: string) {
    super(
      `El cron job con el identificador "${id}" no fue encontrado`,
      ErrorCodes.CRON_JOB_NOT_FOUND,
    )
  }
}
