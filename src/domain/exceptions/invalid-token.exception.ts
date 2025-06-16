import { BaseException } from './base.exception'
import { ErrorKeys } from './error-keys.enum'

export class InvalidTokenException extends BaseException {
  constructor() {
    super('Token inválido o expirado', ErrorKeys.INVALID_TOKEN)
  }
}
