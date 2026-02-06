import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-keys.enum'

export class ChapterDoesNotBelongToMangaException extends BaseException {
  constructor(chapterId: string, mangaId: string) {
    super(
      `El capítulo ${chapterId} no pertenece al manga ${mangaId}`,
      ErrorCodes.CHAPTER_DOES_NOT_BELONG_TO_MANGA,
    )
  }
}
