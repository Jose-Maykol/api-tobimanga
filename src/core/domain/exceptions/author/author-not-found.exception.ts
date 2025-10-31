import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-codes.enum'

export class AuthorNotFoundException extends BaseException {
  constructor(id: string) {
    super(`No se encontró el autor con id "${id}"`, ErrorCodes.AUTHOR_NOT_FOUND)
  }
}
