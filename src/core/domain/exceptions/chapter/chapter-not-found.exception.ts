import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-keys.enum'

export class ChapterNotFoundException extends BaseException {
  constructor(chapterId: string) {
    super(
      `Capítulo con ID ${chapterId} no encontrado`,
      ErrorCodes.CHAPTER_NOT_FOUND,
    )
  }
}
