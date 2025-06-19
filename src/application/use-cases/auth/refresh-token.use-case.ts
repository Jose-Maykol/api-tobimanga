import { InvalidRefreshTokenException } from '@/domain/exceptions/invalid-refresh-token.exception'
import { RefreshTokenNotFoundException } from '@/domain/exceptions/refresh-token-not-found.exception'
import { UserNotFoundException } from '@/domain/exceptions/user-not-found.exception'
import { UserRepository } from '@/domain/repositories/user.repository'
import { Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

export class RefreshTokenUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async execute(
    userId: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new UserNotFoundException()

    const { refreshToken: hashedRefreshToken } = user

    if (!hashedRefreshToken) {
      throw new RefreshTokenNotFoundException()
    }

    const isValidToken = await bcrypt.compare(refreshToken, hashedRefreshToken)

    if (!isValidToken) {
      throw new InvalidRefreshTokenException()
    }

    const { id, email } = user
    const tokens = await this.generateTokens(id, email)

    await this.updateRefreshToken(userId, tokens.refreshToken)

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    }
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    const hashedToken = refreshToken
      ? await bcrypt.hash(refreshToken, 10)
      : null

    await this.userRepository.update(id, {
      refreshToken: hashedToken,
    })
  }

  async generateTokens(userId: string, email: string) {
    const payload = {
      sub: userId,
      email: email,
    }

    const accessPayload = {
      ...payload,
      type: 'access',
    }

    const refreshPayload = {
      ...payload,
      type: 'refresh',
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'),
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRATION_TIME',
        ),
      }),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }
}
