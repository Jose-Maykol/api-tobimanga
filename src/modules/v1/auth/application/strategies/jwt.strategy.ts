import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { QueryBus } from '@nestjs/cqrs'
/* import { CheckUserExistsQuery } from '../queries/check-user-exists.query' */
import { Payload } from '@/modules/v1/shared/types/payload'
import { AuthenticatedUser } from '@/common/interfaces/authenticated-user.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private queryBus: QueryBus,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SECRET_KEY'),
    })
  }

  async validate(payload: Payload): Promise<AuthenticatedUser> {
    const { email, sub, exp } = payload

    if (!email || !sub || !exp) {
      throw new UnauthorizedException('Token no válido')
    }

    const now = Date.now() / 1000
    if (now > exp) {
      throw new UnauthorizedException('Token expirado')
    }

    /* const query = new CheckUserExistsQuery(sub)
    const user = await this.queryBus.execute(query)

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado')
    } */

    return {
      username: payload.username,
      email: payload.email,
      id: payload.sub,
    }
  }
}
