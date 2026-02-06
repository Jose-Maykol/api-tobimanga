import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-codes.enum'

export class GenreNotFoundException extends BaseException {
  constructor(id: string) {
    super(
      `El género con el identificador "${id}" no fue encontrado`,
      ErrorCodes.GENRE_NOT_FOUND,
    )
  }
}
