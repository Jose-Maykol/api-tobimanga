import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthenticatedUser } from '@/common/interfaces/authenticated-user.interface'
import { DecodedJwtPayload } from '../../domain/interfaces/auth.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
    })
  }

  async validate(payload: DecodedJwtPayload): Promise<AuthenticatedUser> {
    const { email, sub } = payload

    if (payload.type !== 'access') {
      throw new UnauthorizedException('Token inválido')
    }

    if (!email || !sub) {
      throw new UnauthorizedException('Token inválido')
    }

    /* const query = new CheckUserExistsQuery(sub)
    const user = await this.queryBus.execute(query)

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado')
    } */

    return {
      email: payload.email,
      id: payload.sub,
    }
  }
}
