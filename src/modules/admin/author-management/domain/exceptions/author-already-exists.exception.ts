import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-codes'

export class AuthorAlreadyExistsException extends BaseException {
  constructor(name: string) {
    super(
      `El autor con el nombre "${name}" ya se encuentra registrado`,
      ErrorCodes.AUTHOR_ALREADY_EXISTS,
    )
  }
}
