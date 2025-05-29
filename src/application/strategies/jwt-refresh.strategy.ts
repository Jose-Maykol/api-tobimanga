import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { JwtPayload } from '../../domain/interfaces/auth.interface'
import { UserRepository } from '@/domain/repositories/user.repository'
import * as bcrypt from 'bcrypt'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
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

    const isValidToken = await this.validateRefreshToken(
      payload.sub,
      refreshToken,
    )

    if (!isValidToken) throw new UnauthorizedException('Refresh token inválido')

    /* const user = await this.usersService.findById(payload.sub)
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    } */
  }

  async validateRefreshToken(id: string, refreshToken: string) {
    const user = await this.userRepository.findById(id)
    if (!user || !user.refreshToken) return false
    const isValid = await bcrypt.compare(refreshToken, user.refreshToken)
    return isValid
  }
}
