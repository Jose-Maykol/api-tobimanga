import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-codes'

export class GenreAlreadyExistsException extends BaseException {
  constructor(name: string) {
    super(
      `El género con el nombre "${name}" ya se encuentra registrado`,
      ErrorCodes.GENRE_ALREADY_EXISTS,
    )
  }
}
