import { Inject, Injectable, Logger } from '@nestjs/common'

import { UserRepository } from '@/core/domain/repositories/user.repository'
import { InvalidRefreshTokenException } from '@/modules/auth/domain/exceptions/invalid-refresh-token.exception'
import { RefreshTokenNotFoundException } from '@/modules/auth/domain/exceptions/refresh-token-not-found.exception'
import { GetUserByIdUseCase } from '@/modules/user/application/use-cases/get-user-by-id.use-case'

import { RefreshTokenService } from '../../domain/services/refresh-token.service'

@Injectable()
export class LogoutUserUseCase {
  private readonly logger = new Logger(LogoutUserUseCase.name)

  constructor(
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    @Inject('RefreshTokenService')
    private readonly refreshTokenService: RefreshTokenService,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string, refreshToken: string): Promise<void> {
    this.logger.log(`Logout attempt for userId: ${userId}`)

    const user = await this.getUserByIdUseCase.execute(userId)

    if (!user.refreshToken) {
      this.logger.warn(`No refresh token found for userId: ${userId}`)
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

    await this.userRepository.update(userId, {
      refreshToken: null,
    })
    this.logger.log(`Logout successful for userId: ${userId}`)
  }
}
