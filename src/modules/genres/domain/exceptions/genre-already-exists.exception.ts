import { BaseException } from '@/common/exceptions/base.exception'
import { ErrorCodes } from './error-codes.enum'

export class GenreAlreadyExistsException extends BaseException {
  constructor(name: string) {
    super(
      `Ya existe un género con el nombre ${name}`,
      ErrorCodes.GENRE_ALREADY_EXISTS,
    )
  }
}
