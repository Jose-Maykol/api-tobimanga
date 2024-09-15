import { Injectable, NestMiddleware } from '@nestjs/common'
import { Response, Request, NextFunction } from 'express'
import * as humps from 'humps'

@Injectable()
export class SnakeCaseMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Transformar el cuerpo, parámetros y queries de la request a camelCase
    if (req.body && typeof req.body === 'object') {
      req.body = humps.camelizeKeys(req.body)
    }

    if (req.query && typeof req.query === 'object') {
      req.query = humps.camelizeKeys(req.query)
    }

    if (req.params && typeof req.params === 'object') {
      req.params = humps.camelizeKeys(req.params)
    }

    // Guardar el método original de enviar JSON de la respuesta
    const originalSend = res.json

    // Transformar la respuesta a snake_case
    res.json = (body: any) => {
      if (body && typeof body === 'object') {
        body = humps.decamelizeKeys(body)
      }
      return originalSend.call(res, body)
    }

    next()
  }
}
