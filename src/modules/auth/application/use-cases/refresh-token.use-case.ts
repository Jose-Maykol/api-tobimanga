import { Inject, Injectable } from '@nestjs/common'

import { RefreshTokenService } from '@/modules/auth/domain/services/refresh-token.service'

import { InvalidRefreshTokenException } from '../../domain/exceptions/invalid-refresh-token.exception'
import { RefreshTokenNotFoundException } from '../../domain/exceptions/refresh-token-not-found.exception'
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { UserRepository } from '../../domain/repositories/auth-user.repository'
import { AccessTokenService } from '../../domain/services/access-token.service'

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('AccessTokenService')
    private readonly accessTokenService: AccessTokenService,
    @Inject('RefreshTokenService')
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async execute(userId: string, refreshToken: string) {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new UserNotFoundException(`User with id ${userId} not found`)
    }

    if (!user.refreshToken) {
      throw new RefreshTokenNotFoundException()
    }

    const isRefreshTokenValid = this.refreshTokenService.verifyToken(
      refreshToken,
      user.refreshToken,
    )

    if (!isRefreshTokenValid) {
      throw new InvalidRefreshTokenException()
    }

    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.accessTokenService.generateToken({
        sub: user.id,
        email: user.email,
        roles: user.roles,
      }),
      Promise.resolve(this.refreshTokenService.generateToken()),
    ])

    const hashedRefreshToken =
      this.refreshTokenService.hashToken(newRefreshToken)
    await this.userRepository.updateRefreshToken(user.id, hashedRefreshToken)

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }
  }
}
