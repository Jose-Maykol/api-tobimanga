import { BaseException } from '../../../../domain/exceptions/base.exception'
import { ErrorKeys } from '../../../../domain/exceptions/error-keys.enum'

export class UserAlreadyExistsException extends BaseException {
  constructor() {
    super('El usuario ya existe', ErrorKeys.USER_ALREADY_EXISTS)
  }
}
