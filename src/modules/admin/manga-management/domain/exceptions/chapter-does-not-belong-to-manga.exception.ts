import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-codes'

export class ChapterDoesNotBelongToMangaException extends BaseException {
  constructor(chapterId: string, mangaId: string) {
    super(
      `El capítulo con identificador "${chapterId}" no pertenece al manga con identificador "${mangaId}"`,
      ErrorCodes.CHAPTER_DOES_NOT_BELONG_TO_MANGA,
    )
  }
}
