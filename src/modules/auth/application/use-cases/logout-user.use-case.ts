import { UserNotFoundException } from '@/domain/exceptions/user-not-found.exception'
import { RefreshTokenNotFoundException } from '@/modules/auth/domain/exceptions/refresh-token-not-found.exception'
import { InvalidRefreshTokenException } from '@/modules/auth/domain/exceptions/invalid-refresh-token.exception'
import { UserRepository } from '@/domain/repositories/user.repository'
import { Inject } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

export class LogoutUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string, refreshToken: string): Promise<void> {
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

    await this.userRepository.update(userId, {
      refreshToken: null,
    })
  }
}
