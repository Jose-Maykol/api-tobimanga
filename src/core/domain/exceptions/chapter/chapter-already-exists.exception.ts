import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-keys.enum'

export class ChapterAlreadyExistsException extends BaseException {
  constructor(chapterNumber: number, mangaId: string) {
    super(
      `El capítulo número ${chapterNumber} ya se encuentra registrado para el manga con identificador "${mangaId}"`,
      ErrorCodes.CHAPTER_ALREADY_EXISTS,
    )
  }
}
