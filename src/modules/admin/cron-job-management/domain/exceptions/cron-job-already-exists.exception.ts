import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-codes'

export class CronJobAlreadyExistsException extends BaseException {
  constructor(key: string) {
    super(
      `Ya existe un cron job con la clave "${key}"`,
      ErrorCodes.CRON_JOB_ALREADY_EXISTS,
    )
  }
}
