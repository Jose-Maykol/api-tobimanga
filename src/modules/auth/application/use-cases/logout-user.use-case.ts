import { Inject, Injectable, Logger } from '@nestjs/common'

import { RefreshTokenService } from '@/modules/auth/domain/services/refresh-token.service'

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

  async execute(refreshToken: string) {
    if (!refreshToken) return

    const hashedIncomingToken = this.refreshTokenService.hashToken(refreshToken)
    const user =
      await this.userRepository.findByRefreshToken(hashedIncomingToken)

    if (!user) {
      this.logger.warn(`Logout attempt with invalid refresh token`)
      return // Silently return if token is already invalid/not found for logout
    }

    this.logger.log(`Logout attempt for userId: ${user.id}`)

    await this.userRepository.updateRefreshToken(user.id, null)

    this.logger.log(`Logout successful for userId: ${user.id}`)
  }
}
