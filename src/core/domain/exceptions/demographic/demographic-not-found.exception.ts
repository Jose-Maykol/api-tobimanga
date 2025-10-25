import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-codes.enum'

export class DemographicNotFoundException extends BaseException {
  constructor(name: string) {
    super(
      `No se encontró la demografía ${name}`,
      ErrorCodes.DEMOGRAPHIC_NOT_FOUND,
    )
  }
}
