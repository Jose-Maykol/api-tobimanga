import * as crypto from 'crypto'

export class TokenGenerator {
  static generateOpaqueToken(bytes: number = 32): string {
    return crypto
      .randomBytes(bytes)
      .toString('base64')
      .replace(/\//g, '_')
      .replace(/\+/g, '-')
      .replace(/=+$/, '')
  }

  static hashToken(token: string): string {
    return crypto
      .createHash('sha256')
      .update(token)
      .digest('base64')
      .replace(/\//g, '_')
      .replace(/\+/g, '-')
      .replace(/=+$/, '')
  }

  static compareToken(token: string, hash: string): boolean {
    const tokenHash = this.hashToken(token)
    return crypto.timingSafeEqual(
      Buffer.from(tokenHash, 'base64'),
      Buffer.from(hash, 'base64'),
    )
  }
}
