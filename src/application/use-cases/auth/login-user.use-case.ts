import { JwtPayload } from '@/domain/interfaces/auth.interface'
import { UserRepository } from '@/domain/repositories/user.repository'
import { UserNotFoundException } from '@/domain/exceptions/user-not-found.exception'
import { InvalidCredentialsException } from '@/domain/exceptions/invalid-credentials.exception'
import { TokenGenerator } from '@/common/utils/token.util'
import { Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

export class LoginUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
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
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    })
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    const hashedToken = refreshToken
      ? TokenGenerator.hashToken(refreshToken)
      : null
    await this.userRepository.update(id, {
      refreshToken: hashedToken,
    })
  }

  async validateRefreshToken(id: string, refreshToken: string) {
    const user = await this.userRepository.findById(id)
    if (!user || !user.refreshToken) return false
    return TokenGenerator.compareToken(refreshToken, user.refreshToken)
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  async generateTokens(
    userId: string,
    email: string,
    role: 'USER' | 'ADMIN',
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessPayload: JwtPayload = {
      sub: userId,
      email,
      role: role,
    }

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'),
    })

    const refreshToken = TokenGenerator.generateOpaqueToken()

    return {
      accessToken,
      refreshToken,
    }
  }
}
