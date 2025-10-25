import { BaseException } from '@/common/exceptions/base.exception'
import { ErrorCodes } from '../../../../core/domain/exceptions/author/error-codes.enum'

export class AuthorAlreadyExistsException extends BaseException {
  constructor(name: string) {
    super(`El autor ${name} ya existe`, ErrorCodes.AUTHOR_ALREADY_EXISTS)
  }
}
