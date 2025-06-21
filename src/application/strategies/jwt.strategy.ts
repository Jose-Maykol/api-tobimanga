import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthenticatedUser } from '@/common/interfaces/authenticated-user.interface'
import { DecodedJwtPayload } from '../../domain/interfaces/auth.interface'
import { ResponseBuilder } from '@/common/utils/response.util'
import { ErrorKeys } from '@/domain/exceptions/error-keys.enum'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    })
  }

  async validate(payload: DecodedJwtPayload): Promise<AuthenticatedUser> {
    const { email, sub } = payload

    if (!email || !sub) {
      throw new HttpException(
        ResponseBuilder.error(
          'Token inválido',
          ErrorKeys.INVALID_ACCESS_TOKEN,
          HttpStatus.UNAUTHORIZED,
        ),
        HttpStatus.UNAUTHORIZED,
      )
    }

    //TODO: Verity token expiration

    return {
      email: payload.email,
      id: payload.sub,
      role: payload.role,
    }
  }
}
