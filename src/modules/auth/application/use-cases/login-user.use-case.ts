import * as bcrypt from 'bcrypt'

import { Inject, Injectable } from '@nestjs/common'

import { UserRepository } from '@/core/domain/repositories/user.repository'
import { GetUserByEmailUseCase } from '@/modules/user/application/use-cases/get-user-by-email.use-case'

import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception'
import { AccessTokenService } from '../../domain/services/access-token.service'
import { RefreshTokenService } from '../../domain/services/refresh-token.service'

@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('AccessTokenService')
    private readonly accessTokenService: AccessTokenService,
    @Inject('RefreshTokenService')
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async execute(email: string, password: string) {
    // 1. Obtener usuario y validar credenciales
    const user = await this.getUserByEmailUseCase.execute(email)
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new InvalidCredentialsException()
    }

    // 2. Generar tokens
    const [accessToken, refreshToken] = await Promise.all([
      this.accessTokenService.generateToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
      Promise.resolve(this.refreshTokenService.generateToken()),
    ])

    // 3. Actualizar refresh token en base de datos
    const hashedRefreshToken = this.refreshTokenService.hashToken(refreshToken)
    await this.userRepository.update(user.id, {
      refreshToken: hashedRefreshToken,
    })

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage,
      },
    }
  }
}
