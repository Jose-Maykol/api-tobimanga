import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-keys.enum'

export class ChapterNotFoundException extends BaseException {
  constructor(chapterId: string) {
    super(
      `El capítulo con el identificador "${chapterId}" no fue encontrado`,
      ErrorCodes.CHAPTER_NOT_FOUND,
    )
  }
}
