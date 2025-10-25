import { BaseException } from '@/common/exceptions/base.exception'
import { ErrorCodes } from './error-codes.enum'

export class GenreNotFoundException extends BaseException {
  constructor(name: string) {
    super(`No se encontró el género ${name}`, ErrorCodes.GENRE_NOT_FOUND)
  }
}
