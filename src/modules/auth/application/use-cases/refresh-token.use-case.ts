import { Inject, Injectable } from '@nestjs/common'

import { RefreshTokenService } from '@/modules/auth/domain/services/refresh-token.service'

import { InvalidRefreshTokenException } from '../../domain/exceptions/invalid-refresh-token.exception'
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

  async execute(refreshToken: string) {
    if (!refreshToken) {
      throw new InvalidRefreshTokenException()
    }

    const hashedIncomingToken = this.refreshTokenService.hashToken(refreshToken)
    const user =
      await this.userRepository.findByRefreshToken(hashedIncomingToken)

    if (!user) {
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
