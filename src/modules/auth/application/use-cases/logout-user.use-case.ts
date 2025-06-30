import { RefreshTokenNotFoundException } from '@/modules/auth/domain/exceptions/refresh-token-not-found.exception'
import { InvalidRefreshTokenException } from '@/modules/auth/domain/exceptions/invalid-refresh-token.exception'
import { GetUserByIdUseCase } from '@/modules/user/application/use-cases/get-user-by-id.use-case'
import { Inject, Injectable } from '@nestjs/common'
import { RefreshTokenService } from '../../domain/services/refresh-token.service'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'

@Injectable()
export class LogoutUserUseCase {
  constructor(
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    @Inject('RefreshTokenService')
    private readonly refreshTokenService: RefreshTokenService,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string, refreshToken: string): Promise<void> {
    // 1. Obtener usuario y validar token
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

    // 2. Limpiar el refresh token
    await this.userRepository.update(userId, {
      refreshToken: null,
    })
  }
}
