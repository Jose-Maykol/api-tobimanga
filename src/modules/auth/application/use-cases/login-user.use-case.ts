import { Inject, Injectable, Logger } from '@nestjs/common'

import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception'
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { UserRepository } from '../../domain/repositories/auth-user.repository'
import { AccessTokenService } from '../../domain/services/access-token.service'
import { PasswordHashingService } from '../../domain/services/password-hashing.service'
import { RefreshTokenService } from '../../domain/services/refresh-token.service'

@Injectable()
export class LoginUserUseCase {
  private readonly logger = new Logger(LoginUserUseCase.name)

  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('AccessTokenService')
    private readonly accessTokenService: AccessTokenService,
    @Inject('RefreshTokenService')
    private readonly refreshTokenService: RefreshTokenService,
    @Inject('PasswordHashingService')
    private readonly passwordHashingService: PasswordHashingService,
  ) {}

  async execute(email: string, password: string) {
    this.logger.log(`Login attempt for email: ${email}`)

    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      this.logger.warn(`User not found for email: ${email}`)
      throw new UserNotFoundException(email)
    }

    const isPasswordValid = await this.passwordHashingService.compare(
      password,
      user.password,
    )
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
    await this.userRepository.updateRefreshToken(user.id, hashedRefreshToken)
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
