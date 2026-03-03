import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-codes'

export class ChapterProgressNotFoundException extends BaseException {
  constructor(chapterId: string) {
    super(
      `No se encontró progreso de lectura para el capítulo "${chapterId}"`,
      ErrorCodes.CHAPTER_PROGRESS_NOT_FOUND,
    )
  }
}
