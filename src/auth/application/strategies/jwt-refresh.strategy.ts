import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { JwtPayload } from '../../domain/interfaces/auth.interface'
import { AuthService } from '../../../application/use-cases/auth.service'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('REFRESH_SECRET_KEY'),
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: JwtPayload) {
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Token inválido')
    }

    const refreshToken = req.body?.refresh_token
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token requerido')
    }

    /* const isValidToken = await this.authService.validateRefreshToken(
      payload.sub,
      refreshToken,
    )
    if (!isValidToken) {
      throw new UnauthorizedException('Refresh token inválido')
    } */

    /* const user = await this.usersService.findById(payload.sub)
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    } */
  }
}
