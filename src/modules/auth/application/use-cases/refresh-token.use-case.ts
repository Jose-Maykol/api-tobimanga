import { Inject, Injectable, Logger } from '@nestjs/common'

import { UserRepository } from '@/core/domain/repositories/user.repository'
import { InvalidRefreshTokenException } from '@/modules/auth/domain/exceptions/invalid-refresh-token.exception'
import { RefreshTokenNotFoundException } from '@/modules/auth/domain/exceptions/refresh-token-not-found.exception'
import { GetUserByIdUseCase } from '@/modules/user/application/use-cases/get-user-by-id.use-case'

import { AccessTokenService } from '../../domain/services/access-token.service'
import { RefreshTokenService } from '../../domain/services/refresh-token.service'

@Injectable()
export class RefreshTokenUseCase {
  private readonly logger = new Logger(RefreshTokenUseCase.name)

  constructor(
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    @Inject('AccessTokenService')
    private readonly accessTokenService: AccessTokenService,
    @Inject('RefreshTokenService')
    private readonly refreshTokenService: RefreshTokenService,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    userId: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.log(`Refresh token attempt for userId: ${userId}`)

    if (!refreshToken?.trim()) {
      this.logger.warn(`No refresh token provided for userId: ${userId}`)
      throw new InvalidRefreshTokenException()
    }

    const user = await this.getUserByIdUseCase.execute(userId)
    if (!user.refreshToken) {
      this.logger.warn(`No stored refresh token for userId: ${userId}`)
      throw new RefreshTokenNotFoundException()
    }

    const isValidToken = this.refreshTokenService.compareTokens(
      refreshToken,
      user.refreshToken,
    )
    if (!isValidToken) {
      this.logger.warn(`Invalid refresh token for userId: ${userId}`)
      throw new InvalidRefreshTokenException()
    }

    const [accessToken, newRefreshToken] = await Promise.all([
      this.accessTokenService.generateToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
      Promise.resolve(this.refreshTokenService.generateToken()),
    ])

    const hashedRefreshToken =
      this.refreshTokenService.hashToken(newRefreshToken)
    await this.userRepository.update(user.id, {
      refreshToken: hashedRefreshToken,
    })

    this.logger.log(`Refresh token successful for userId: ${userId}`)

    return {
      accessToken,
      refreshToken: newRefreshToken,
    }
  }
}
