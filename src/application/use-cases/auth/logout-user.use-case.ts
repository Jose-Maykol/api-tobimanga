import { UserNotFoundException } from '@/modules/user/domain/exceptions/user-not-found.exception'
import { RefreshTokenNotFoundException } from '@/domain/exceptions/refresh-token-not-found.exception'
import { InvalidRefreshTokenException } from '@/domain/exceptions/invalid-refresh-token.exception'
import { UserRepository } from '@/domain/repositories/user.repository'
import { RefreshTokenService } from '@/domain/services/refresh-token.service'
import { Inject } from '@nestjs/common'

export class LogoutUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('RefreshTokenService')
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async execute(userId: string, refreshToken: string): Promise<void> {
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

    await this.userRepository.update(userId, {
      refreshToken: null,
    })
  }
}
