import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-codes'

export class UploadNotFoundException extends BaseException {
  constructor(id: string) {
    super(
      `El upload con el identificador "${id}" no fue encontrado`,
      ErrorCodes.UPLOAD_NOT_FOUND,
    )
  }
}
