import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-codes'

export class AuthorNotFoundException extends BaseException {
  constructor(id: string) {
    super(
      `El autor con el identificador "${id}" no fue encontrado`,
      ErrorCodes.AUTHOR_NOT_FOUND,
    )
  }
}
