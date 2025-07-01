import { BaseException } from '../../../../common/exceptions/base.exception'
import { ErrorCodes } from './error-keys.enum'

export class InvalidCredentialsException extends BaseException {
  constructor() {
    super('Credenciales incorrectas', ErrorCodes.INVALID_CREDENTIALS)
  }
}
