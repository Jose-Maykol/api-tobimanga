import { BaseException } from '@/common/exceptions/base.exception'

import { ErrorCodes } from './error-codes'

export class MangaAlreadyExistsException extends BaseException {
  constructor(name: string) {
    super(
      `El manga con el nombre "${name}" ya se encuentra registrado`,
      ErrorCodes.MANGA_ALREADY_EXISTS,
    )
  }
}
