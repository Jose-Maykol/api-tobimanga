export interface JwtPayload {
  sub: string
  email: string
  roles: ('USER' | 'ADMIN')[]
}

export interface DecodedJwtPayload extends JwtPayload {
  iat: number
  exp: number
}
