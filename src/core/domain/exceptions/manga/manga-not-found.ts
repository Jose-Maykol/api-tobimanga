import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-keys.enum'

export class MangaNotFoundException extends BaseException {
  constructor(id: string) {
    super(
      `El manga con el identificador "${id}" no fue encontrado`,
      ErrorCodes.MANGA_NOT_FOUND,
    )
  }
}
