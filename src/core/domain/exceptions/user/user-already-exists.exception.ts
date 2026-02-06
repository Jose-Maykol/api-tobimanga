import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-codes.enum'

export class UserAlreadyExistsException extends BaseException {
  constructor(email: string) {
    super(
      `El usuario con el correo electrónico "${email}" ya se encuentra registrado`,
      ErrorCodes.USER_ALREADY_EXISTS,
    )
  }
}
