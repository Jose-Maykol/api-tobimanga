import { BaseException } from '../../../../domain/exceptions/base.exception'
import { ErrorKeys } from '../../../../domain/exceptions/error-keys.enum'

export class UserNotFoundException extends BaseException {
  constructor() {
    super('Usuario no encontrado', ErrorKeys.USER_NOT_FOUND)
  }
}
