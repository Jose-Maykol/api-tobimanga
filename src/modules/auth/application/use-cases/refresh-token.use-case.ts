import { Inject, Injectable } from '@nestjs/common'

import { UserRepository } from '@/core/domain/repositories/user.repository'
import { InvalidRefreshTokenException } from '@/modules/auth/domain/exceptions/invalid-refresh-token.exception'
import { RefreshTokenNotFoundException } from '@/modules/auth/domain/exceptions/refresh-token-not-found.exception'
import { GetUserByIdUseCase } from '@/modules/user/application/use-cases/get-user-by-id.use-case'

import { AccessTokenService } from '../../domain/services/access-token.service'
import { RefreshTokenService } from '../../domain/services/refresh-token.service'

@Injectable()
export class RefreshTokenUseCase {
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
    // 1. Validar el refresh token
    if (!refreshToken?.trim()) {
      throw new InvalidRefreshTokenException()
    }

    // 2. Obtener usuario y validar token
    const user = await this.getUserByIdUseCase.execute(userId)
    if (!user.refreshToken) {
      throw new RefreshTokenNotFoundException()
    }

    const isValidToken = this.refreshTokenService.compareTokens(
      refreshToken,
      user.refreshToken,
    )
    if (!isValidToken) {
      throw new InvalidRefreshTokenException()
    }

    // 3. Generar nuevos tokens
    const [accessToken, newRefreshToken] = await Promise.all([
      this.accessTokenService.generateToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
      Promise.resolve(this.refreshTokenService.generateToken()),
    ])

    // 4. Actualizar refresh token en base de datos
    const hashedRefreshToken =
      this.refreshTokenService.hashToken(newRefreshToken)
    await this.userRepository.update(user.id, {
      refreshToken: hashedRefreshToken,
    })

    return {
      accessToken,
      refreshToken: newRefreshToken,
    }
  }
}
