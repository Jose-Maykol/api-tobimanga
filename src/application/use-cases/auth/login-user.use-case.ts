import { JwtPayload } from '@/domain/interfaces/auth.interface'
import { UserRepository } from '@/domain/repositories/user.repository'
import { UserNotFoundException } from '@/modules/user/domain/exceptions/user-not-found.exception'
import { InvalidCredentialsException } from '@/domain/exceptions/invalid-credentials.exception'
import { RefreshTokenService } from '@/domain/services/refresh-token.service'
import { AccessTokenService } from '@/domain/services/access-token.service'
import { Inject } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

export class LoginUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('RefreshTokenService')
    private readonly refreshTokenService: RefreshTokenService,
    @Inject('AccessTokenService')
    private readonly accessTokenService: AccessTokenService,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email)
    if (!user) throw new UserNotFoundException()

    const isPasswordValid = await this.comparePasswords(password, user.password)
    if (!isPasswordValid) throw new InvalidCredentialsException()

    const tokens = await this.generateTokens(user.id, user.email, user.role)
    await this.updateRefreshToken(user.id, tokens.refreshToken)

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage,
      },
    }
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    return this.accessTokenService.verifyToken(token)
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    const hashedToken = refreshToken
      ? this.refreshTokenService.hashToken(refreshToken)
      : null
    await this.userRepository.update(id, {
      refreshToken: hashedToken,
    })
  }

  async validateRefreshToken(id: string, refreshToken: string) {
    const user = await this.userRepository.findById(id)
    if (!user || !user.refreshToken) return false
    return this.refreshTokenService.compareTokens(
      refreshToken,
      user.refreshToken,
    )
  }

  private async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: 'USER' | 'ADMIN',
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.accessTokenService.generateToken({ sub: userId, email, role }),
      Promise.resolve(this.refreshTokenService.generateToken()),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }
}
