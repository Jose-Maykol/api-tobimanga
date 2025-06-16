import { BaseException } from './base.exception'
import { ErrorKeys } from './error-keys.enum'

export class InvalidCredentialsException extends BaseException {
  constructor() {
    super('Credenciales incorrectas', ErrorKeys.INVALID_CREDENTIALS)
  }
}
