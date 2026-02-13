import { BaseException } from '@/common/exceptions/base.exception'

export class UserAlreadyExistsException extends BaseException {
  constructor(email: string) {
    super(
      `El usuario con el correo "${email}" ya existe`,
      'USER_ALREADY_EXISTS',
    )
  }
}
