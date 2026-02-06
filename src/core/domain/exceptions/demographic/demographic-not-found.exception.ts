import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-codes.enum'

export class DemographicNotFoundException extends BaseException {
  constructor(id: string) {
    super(
      `La demografía con el identificador "${id}" no fue encontrada`,
      ErrorCodes.DEMOGRAPHIC_NOT_FOUND,
    )
  }
}
