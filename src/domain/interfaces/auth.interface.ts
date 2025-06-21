export interface JwtPayload {
  sub: string
  email: string
  role: 'USER' | 'ADMIN'
}

export interface DecodedJwtPayload extends JwtPayload {
  iat: number
  exp: number
}
