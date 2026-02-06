import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-keys.enum'

export class ChapterAlreadyExistsException extends BaseException {
  constructor(chapterNumber: number, mangaTitle: string) {
    super(
      `El capítulo ${chapterNumber} ya existe para el manga ${mangaTitle}`,
      ErrorCodes.CHAPTER_ALREADY_EXISTS,
    )
  }
}
