import { JwtPayload } from '../interfaces/auth.interface'

export interface AccessTokenService {
  generateToken(payload: JwtPayload): Promise<string>
  verifyToken(token: string): Promise<JwtPayload>
}
