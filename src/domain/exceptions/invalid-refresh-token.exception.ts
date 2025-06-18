import { BaseException } from './base.exception'
import { ErrorKeys } from './error-keys.enum'

export class InvalidRefreshTokenException extends BaseException {
  constructor() {
    super('Refresh token inválido', ErrorKeys.INVALID_REFRESH_TOKEN)
  }
}
