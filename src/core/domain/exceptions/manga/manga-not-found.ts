import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-keys.enum'

export class MangaNotFoundException extends BaseException {
  constructor() {
    super('Manga no encontrado', ErrorCodes.MANGA_NOT_FOUND)
  }
}
