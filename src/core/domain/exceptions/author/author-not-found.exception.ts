import { BaseException } from '@/common/exceptions/base.exception'
import { ErrorCodes } from './error-codes.enum'

export class AuthorNotFoundException extends BaseException {
  constructor(name: string) {
    super(`No se encontró al autor ${name}`, ErrorCodes.AUTHOR_NOT_FOUND)
  }
}
