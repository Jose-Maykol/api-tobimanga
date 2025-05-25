import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { JwtPayload } from '../../domain/interfaces/auth.interface'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword)
    if (!isPasswordValid) return false
    return true
  }

  async generateTokens(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessPayload: JwtPayload = {
      sub: userId,
      email,
      type: 'access',
    }

    const refreshPayload: JwtPayload = {
      sub: userId,
      email,
      type: 'refresh',
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_EXPIRES_IN',
          '60m',
        ),
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRES_IN',
          '7d',
        ),
      }),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    })
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    })
  }
}
