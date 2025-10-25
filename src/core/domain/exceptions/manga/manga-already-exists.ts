import { BaseException } from '@/common/exceptions/base.exception'
import { ErrorCodes } from './error-keys.enum'

export class MangaAlreadyExistsException extends BaseException {
  constructor() {
    super('Este manga ya existe', ErrorCodes.MANGA_ALREADY_EXISTS)
  }
}
