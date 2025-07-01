import { BaseException } from '../../../../common/exceptions/base.exception'
import { ErrorCodes } from './error-keys.enum'

export class RefreshTokenNotFoundException extends BaseException {
  constructor() {
    super(
      'No se encontró refresh token para este usuario',
      ErrorCodes.REFRESH_TOKEN_NOT_FOUND,
    )
  }
}
