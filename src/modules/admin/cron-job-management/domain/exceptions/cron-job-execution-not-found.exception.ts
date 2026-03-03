import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-codes'

export class CronJobExecutionNotFoundException extends BaseException {
  constructor(id: string) {
    super(
      `El registro de ejecución con el identificador "${id}" no fue encontrado`,
      ErrorCodes.CRON_JOB_EXECUTION_NOT_FOUND,
    )
  }
}
