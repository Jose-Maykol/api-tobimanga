import { BaseException } from '@/common/exceptions/base.exception'

export class UserNotFoundException extends BaseException {
  constructor(id: string) {
    super(`Usuario con id '${id}' no encontrado`, 'USER_NOT_FOUND')
  }
}
