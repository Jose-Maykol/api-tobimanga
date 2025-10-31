import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-codes.enum'

export class GenreNotFoundException extends BaseException {
  constructor(id: string) {
    super(`No se encontró el género con id "${id}"`, ErrorCodes.GENRE_NOT_FOUND)
  }
}
