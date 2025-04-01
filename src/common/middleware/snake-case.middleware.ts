import { Injectable, NestMiddleware } from '@nestjs/common'
import { Response, Request, NextFunction } from 'express'
import * as humps from 'humps'

@Injectable()
export class SnakeCaseMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    
    if (req.body && typeof req.body === 'object') {
      req.body = humps.camelizeKeys(req.body)
    }

    if (req.query && typeof req.query === 'object') {
      Object.assign(req.query, humps.camelizeKeys(req.query))
    }

    if (req.params && typeof req.params === 'object') {
      req.params = humps.camelizeKeys(req.params)
    }

    const originalSend = res.json

    res.json = (body: any) => {
      if (body && typeof body === 'object') {
        body = humps.decamelizeKeys(body)
      }
      return originalSend.call(res, body)
    }

    next()
  }
}
