import { BaseException } from '../../../../common/exceptions/base.exception'
import { ErrorCodes } from './error-keys.enum'

export class InvalidRefreshTokenException extends BaseException {
  constructor() {
    super('Refresh token inválido', ErrorCodes.INVALID_REFRESH_TOKEN)
  }
}
