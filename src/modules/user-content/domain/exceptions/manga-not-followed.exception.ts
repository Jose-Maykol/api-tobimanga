import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-codes'

export class MangaNotFollowedException extends BaseException {
  constructor(mangaId: string) {
    super(
      `No estás siguiendo el manga con el identificador "${mangaId}"`,
      ErrorCodes.MANGA_NOT_FOLLOWED,
    )
  }
}
