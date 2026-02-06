import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-codes.enum'

export class UserNotFoundException extends BaseException {
  constructor(id: string) {
    super(
      `El usuario con el identificador "${id}" no fue encontrado`,
      ErrorCodes.USER_NOT_FOUND,
    )
  }
}
