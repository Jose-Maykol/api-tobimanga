export interface RefreshTokenService {
  generateToken(): string
  hashToken(token: string): string
  compareTokens(token: string, hash: string): boolean
}
