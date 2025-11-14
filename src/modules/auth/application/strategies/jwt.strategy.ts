import { ExtractJwt, Strategy } from 'passport-jwt'

import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { AuthenticatedUser } from '@/common/interfaces/authenticated-user.interface'
import { ResponseBuilder } from '@/common/utils/response.util'
import { ErrorCodes } from '@/modules/auth/domain/exceptions/error-keys.enum'

import { DecodedJwtPayload } from '../../domain/interfaces/auth.interface'
import { AccessTokenService } from '../../domain/services/access-token.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name)

  constructor(
    private configService: ConfigService,
    @Inject('AccessTokenService')
    private accessTokenService: AccessTokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    })
  }

  async validate(payload: DecodedJwtPayload): Promise<AuthenticatedUser> {
    try {
      const { email, sub } = payload

      this.logger.log(`Validating JWT for userId: ${sub}, email: ${email}`)

      if (!email || !sub) {
        this.logger.warn(`Invalid JWT payload: missing email or sub`)
        throw new HttpException(
          ResponseBuilder.error(
            'Token inválido',
            ErrorCodes.INVALID_ACCESS_TOKEN,
            HttpStatus.UNAUTHORIZED,
          ),
          HttpStatus.UNAUTHORIZED,
        )
      }

      return {
        email: payload.email,
        id: payload.sub,
        role: payload.role,
      }
    } catch (error) {
      this.logger.warn(`JWT validation failed: ${error.message}`)

      throw new HttpException(
        ResponseBuilder.error(
          'Token inválido o expirado',
          ErrorCodes.INVALID_ACCESS_TOKEN,
          HttpStatus.UNAUTHORIZED,
        ),
        HttpStatus.UNAUTHORIZED,
      )
    }
  }
}
