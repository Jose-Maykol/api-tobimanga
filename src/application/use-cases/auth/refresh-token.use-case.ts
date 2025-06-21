import { TokenGenerator } from '@/common/utils/token.util'
import { InvalidRefreshTokenException } from '@/domain/exceptions/invalid-refresh-token.exception'
import { RefreshTokenNotFoundException } from '@/domain/exceptions/refresh-token-not-found.exception'
import { UserNotFoundException } from '@/domain/exceptions/user-not-found.exception'
import { UserRepository } from '@/domain/repositories/user.repository'
import { Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from 'jsonwebtoken'

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
    if (
      !refreshToken ||
      typeof refreshToken !== 'string' ||
      refreshToken.trim() === ''
    ) {
      throw new InvalidRefreshTokenException()
    }

    const user = await this.userRepository.findById(userId)
    if (!user) throw new UserNotFoundException()

    const { refreshToken: hashedRefreshToken } = user

    if (!hashedRefreshToken) {
      throw new RefreshTokenNotFoundException()
    }

    const isValidToken = TokenGenerator.compareToken(
      refreshToken,
      hashedRefreshToken,
    )

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
      ? await TokenGenerator.hashToken(refreshToken)
      : null

    await this.userRepository.update(id, {
      refreshToken: hashedToken,
    })
  }

  async generateTokens(userId: string, email: string) {
    const accessPayload: JwtPayload = {
      sub: userId,
      email,
      type: 'access',
    }

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'),
    })

    const refreshToken = TokenGenerator.generateOpaqueToken()

    return {
      accessToken,
      refreshToken,
    }
  }
}
