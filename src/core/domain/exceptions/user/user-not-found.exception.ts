import { BaseException } from '../../../../common/exceptions/base.exception'
import { ErrorCodes } from './error-codes.enum'

export class UserNotFoundException extends BaseException {
  constructor() {
    super('Usuario no encontrado', ErrorCodes.USER_NOT_FOUND)
  }
}
