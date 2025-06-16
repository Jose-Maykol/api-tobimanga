import { BaseException } from './base.exception'
import { ErrorKeys } from './error-keys.enum'

export class UserNotFoundException extends BaseException {
  constructor() {
    super('Usuario no encontrado', ErrorKeys.USER_NOT_FOUND)
  }
}
