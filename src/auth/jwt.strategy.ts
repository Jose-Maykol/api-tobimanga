import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { Injectable, Request, UnauthorizedException } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { configService } from '@/config/config.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getSecretKey(),
    })
  }

  async validate(payload: any, @Request() req: any) {
    const { email, sub, exp } = payload
    if (!email || !sub || !exp) {
      throw new UnauthorizedException('Token no válido')
    }
    const now = Date.now() / 1000
    if (now > exp) {
      throw new UnauthorizedException('Token expirado')
    }
    const user = await this.authService.validateToken(payload)
    if (!user) {
      throw new UnauthorizedException('No autorizado')
    }
    req.user = user
    return user
  }
}
