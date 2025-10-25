import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-codes.enum'

export class InvalidImageException extends BaseException {
  constructor() {
    super('Archivo de imagen no válido', ErrorCodes.INVALID_IMAGE)
  }
}
