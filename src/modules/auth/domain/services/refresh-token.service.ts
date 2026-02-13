export interface RefreshTokenService {
  generateToken(): string
  hashToken(token: string): string
  verifyToken(token: string, hash: string): boolean
}
