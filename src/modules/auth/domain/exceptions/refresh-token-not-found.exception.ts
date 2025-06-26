import { BaseException } from './base.exception'
import { ErrorKeys } from './error-keys.enum'

export class RefreshTokenNotFoundException extends BaseException {
  constructor() {
    super(
      'No se encontró refresh token para este usuario',
      ErrorKeys.REFRESH_TOKEN_NOT_FOUND,
    )
  }
}
