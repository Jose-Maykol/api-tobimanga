import { BaseException } from '../../../../common/exceptions/base.exception'
import { ErrorCodes } from './error-codes.enum'

export class UserAlreadyExistsException extends BaseException {
  constructor() {
    super('El usuario ya existe', ErrorCodes.USER_ALREADY_EXISTS)
  }
}
