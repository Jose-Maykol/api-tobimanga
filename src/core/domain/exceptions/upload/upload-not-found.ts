import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-keys.enum'

export class UploadNotFoundException extends BaseException {
  constructor() {
    super('Upload no encontrado', ErrorCodes.UPLOAD_NOT_FOUND)
  }
}
