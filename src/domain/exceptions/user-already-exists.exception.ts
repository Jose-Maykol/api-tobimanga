import { BaseException } from './base.exception'
import { ErrorKeys } from './error-keys.enum'

export class UserAlreadyExistsException extends BaseException {
  constructor() {
    super('El usuario ya existe', ErrorKeys.USER_ALREADY_EXISTS)
  }
}
