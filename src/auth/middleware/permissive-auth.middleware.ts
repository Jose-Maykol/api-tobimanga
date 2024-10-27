import { Inject, Injectable, NestMiddleware } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from '../auth.service'
import { NextFunction } from 'express'
import { Payload } from '@/shared/payload.interface'
import { configService } from '@/config/config.service'

@Injectable()
export class PermissiveAuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    if (authHeader) {
      const token = authHeader.split(' ')[1]
      if (token) {
        try {
          const payload: Payload = this.jwtService.verify(token, {
            secret: configService.getSecretKey(),
          })
          const user = await this.authService.validateToken(payload.sub)
          if (user) {
            req['user'] = payload
          }
        } catch (error) {
          console.warn('Token inválido o expirado', error.message)
        }
      }
    }
    next()
  }
}
