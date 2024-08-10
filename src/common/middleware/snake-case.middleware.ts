import { Injectable, NestMiddleware } from '@nestjs/common'
import { Response, Request, NextFunction } from 'express'
import * as humps from 'humps'

@Injectable()
export class SnakeCaseMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
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
