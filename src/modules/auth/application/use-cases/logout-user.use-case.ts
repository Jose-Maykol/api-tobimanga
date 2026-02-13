import { Inject, Injectable, Logger } from '@nestjs/common'

import { RefreshTokenService } from '@/modules/auth/domain/services/refresh-token.service'

import { InvalidRefreshTokenException } from '../../domain/exceptions/invalid-refresh-token.exception'
import { RefreshTokenNotFoundException } from '../../domain/exceptions/refresh-token-not-found.exception'
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { UserRepository } from '../../domain/repositories/auth-user.repository'

@Injectable()
export class LogoutUserUseCase {
  private readonly logger = new Logger(LogoutUserUseCase.name)

  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('RefreshTokenService')
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async execute(userId: string, refreshToken: string) {
    this.logger.log(`Logout attempt for userId: ${userId}`)

    const user = await this.userRepository.findById(userId)
    if (!user) {
      this.logger.warn(`User not found for userId: ${userId}`)
      throw new UserNotFoundException(`User with id ${userId} not found`)
    }

    if (!user.refreshToken) {
      this.logger.warn(`No refresh token found for userId: ${userId}`)
      throw new RefreshTokenNotFoundException()
    }

    const isRefreshTokenValid = this.refreshTokenService.verifyToken(
      refreshToken,
      user.refreshToken,
    )

    if (!isRefreshTokenValid) {
      this.logger.warn(`Invalid refresh token for userId: ${userId}`)
      throw new InvalidRefreshTokenException()
    }

    await this.userRepository.updateRefreshToken(userId, null)

    this.logger.log(`Logout successful for userId: ${userId}`)
  }
}
