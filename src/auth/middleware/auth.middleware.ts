import { AuthService } from '@/auth/auth.service'
import { configService } from '@/config/config.service'
import { Payload } from '@/shared/payload.interface'
import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { NextFunction } from 'express'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
      throw new UnauthorizedException(
        'La cabecera de autorización no está presente',
      )
    }
    const token = authHeader.split(' ')[1]
    if (!token) {
      throw new UnauthorizedException('Token no proporcionado')
    }
    try {
      const payload: Payload = this.jwtService.verify(token, {
        secret: configService.getSecretKey(),
      })
      const user = await this.authService.validateToken(payload.sub)
      const now = Date.now() / 1000
      if (now > payload.exp) {
        throw new UnauthorizedException('Token expirado')
      }
      if (!user) {
        throw new UnauthorizedException('No autorizado')
      }
      req['user'] = payload
      next()
    } catch (error) {
      throw new UnauthorizedException('Token no válido')
    }
  }
}
