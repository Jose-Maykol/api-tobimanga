export interface JwtPayload {
  sub: string
  email: string
  type: 'access' | 'refresh'
}

export interface DecodedJwtPayload extends JwtPayload {
  iat: number
  exp: number
}
