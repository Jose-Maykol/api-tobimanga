import { InvalidRefreshTokenException } from '@/domain/exceptions/invalid-refresh-token.exception'
import { RefreshTokenNotFoundException } from '@/domain/exceptions/refresh-token-not-found.exception'
import { UserNotFoundException } from '@/modules/user/domain/exceptions/user-not-found.exception'
import { UserRepository } from '@/domain/repositories/user.repository'
import { RefreshTokenService } from '@/domain/services/refresh-token.service'
import { AccessTokenService } from '@/domain/services/access-token.service'
import { Inject } from '@nestjs/common'

export class RefreshTokenUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('RefreshTokenService')
    private readonly refreshTokenService: RefreshTokenService,
    @Inject('AccessTokenService')
    private readonly accessTokenService: AccessTokenService,
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

    const isValidToken = this.refreshTokenService.compareTokens(
      refreshToken,
      hashedRefreshToken,
    )

    if (!isValidToken) {
      throw new InvalidRefreshTokenException()
    }

    const { id, email, role } = user
    const tokens = await this.generateTokens(id, email, role)

    await this.updateRefreshToken(userId, tokens.refreshToken)

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    }
  }

  private async updateRefreshToken(id: string, refreshToken: string | null) {
    const hashedToken = refreshToken
      ? this.refreshTokenService.hashToken(refreshToken)
      : null

    await this.userRepository.update(id, {
      refreshToken: hashedToken,
    })
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: 'USER' | 'ADMIN',
  ) {
    const [accessToken, refreshToken] = await Promise.all([
      this.accessTokenService.generateToken({ sub: userId, email, role }),
      Promise.resolve(this.refreshTokenService.generateToken()),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }
}
