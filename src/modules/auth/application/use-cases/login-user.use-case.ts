import * as bcrypt from 'bcrypt'
import { Inject, Injectable, Logger } from '@nestjs/common'

import { UserRepository } from '@/core/domain/repositories/user.repository'
import { GetUserByEmailUseCase } from '@/modules/user/application/use-cases/get-user-by-email.use-case'

import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception'
import { AccessTokenService } from '../../domain/services/access-token.service'
import { RefreshTokenService } from '../../domain/services/refresh-token.service'

@Injectable()
export class LoginUserUseCase {
  private readonly logger = new Logger(LoginUserUseCase.name)

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
    this.logger.log(`Login attempt for email: ${email}`)

    const user = await this.getUserByEmailUseCase.execute(email)
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      this.logger.warn(`Invalid credentials for email: ${email}`)
      throw new InvalidCredentialsException()
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.accessTokenService.generateToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
      Promise.resolve(this.refreshTokenService.generateToken()),
    ])

    const hashedRefreshToken = this.refreshTokenService.hashToken(refreshToken)
    await this.userRepository.update(user.id, {
      refreshToken: hashedRefreshToken,
    })
    this.logger.log(`Refresh token updated for userId: ${user.id}`)

    this.logger.log(`Login successful for userId: ${user.id}, email: ${email}`)

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
