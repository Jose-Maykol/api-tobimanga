import { InvalidRefreshTokenException } from '@/modules/auth/domain/exceptions/invalid-refresh-token.exception'
import { RefreshTokenNotFoundException } from '@/modules/auth/domain/exceptions/refresh-token-not-found.exception'
import { Inject } from '@nestjs/common'
import { GetUserByIdUseCase } from '@/modules/user/application/use-cases/get-user-by-id.use-case'
import { UpdateUserUseCase } from '@/modules/user/application/use-cases/update-user.use-case'
import { AccessTokenService } from '../../domain/services/access-token.service'
import { RefreshTokenService } from '../../domain/services/refresh-token.service'

export class RefreshTokenUseCase {
  constructor(
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    @Inject('AccessTokenService')
    private readonly accessTokenService: AccessTokenService,
    @Inject('RefreshTokenService')
    private readonly refreshTokenService: RefreshTokenService,
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
    await this.updateUserUseCase.execute(user.id, {
      refreshToken: hashedRefreshToken,
    })

    return {
      accessToken,
      refreshToken: newRefreshToken,
    }
  }
}
