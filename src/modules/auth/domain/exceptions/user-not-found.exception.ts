import { BaseException } from '@/common/exceptions/base.exception'

export class UserNotFoundException extends BaseException {
  constructor(id: string) {
    super(
      `El usuario con el identificador "${id}" no fue encontrado`,
      'USER_NOT_FOUND',
    )
  }
}
