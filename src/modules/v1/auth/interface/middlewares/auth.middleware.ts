import { Payload } from '@/modules/v1/shared/types/payload'
import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { QueryBus } from '@nestjs/cqrs'
import { JwtService } from '@nestjs/jwt'
import { Request, Response, NextFunction } from 'express'
import { CheckUserExistsQuery } from '../../application/queries/check-user-exists.query'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    private readonly queryBus: QueryBus,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Cabecera de autorización inválida')
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado')
    }

    try {
      const payload: Payload = this.jwtService.verify(token, {
        secret: this.configService.get('SECRET_KEY'),
      })

      const query = new CheckUserExistsQuery(payload.sub)
      await this.queryBus.execute(query)

      const now = Date.now() / 1000

      if (now > payload.exp) {
        throw new UnauthorizedException('Token expirado')
      }

      req['user'] = payload
      next()
    } catch (error) {
      throw new UnauthorizedException('Token no válido')
    }
  }
}
