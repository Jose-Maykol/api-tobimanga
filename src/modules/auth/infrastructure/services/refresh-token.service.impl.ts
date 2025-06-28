import { Injectable } from '@nestjs/common'
import * as crypto from 'crypto'
import { RefreshTokenService } from '../../domain/services/refresh-token.service'

@Injectable()
export class RefreshTokenServiceImpl implements RefreshTokenService {
  generateToken(): string {
    return crypto.randomBytes(64).toString('base64url')
    /* .replace(/\//g, '_')
      .replace(/\+/g, '-')
      .replace(/=+$/, '') */
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('base64')
    /* .replace(/\//g, '_')
      .replace(/\+/g, '-')
      .replace(/=+$/, '') */
  }

  compareTokens(token: string, hash: string): boolean {
    const hashedToken = this.hashToken(token)
    return crypto.timingSafeEqual(Buffer.from(hashedToken), Buffer.from(hash))
  }
}
