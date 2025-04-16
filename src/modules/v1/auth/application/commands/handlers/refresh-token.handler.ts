import { CommandHandler } from '@nestjs/cqrs'
import { RefreshTokenCommand } from '../refresh-token.command'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import {
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { UserRepository } from '../../../domain/repositories/user.repository'
import { Payload } from '@/modules/v1/shared/types/payload'
import * as jwt from 'jsonwebtoken'

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: RefreshTokenCommand) {
    const { refreshToken } = command

    const payload = this.verifyRefreshToken(refreshToken)

    const { sub: userId } = payload

    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new NotFoundException('Usuario no encontrado')
    }

    const newPayload = {
      username: user.getUsername(),
      email: user.getEmail(),
      sub: user.getId(),
    }

    const newRefreshToken = jwt.sign(
      newPayload,
      this.configService.get('REFRESH_SECRET_KEY') as string,
      {
        expiresIn: '7d',
      },
    )

    const newAccessToken = this.jwtService.sign(newPayload)

    return {
      refreshToken: newRefreshToken,
      accessToken: newAccessToken,
    }
  }

  private verifyRefreshToken(token: string): Payload {
    try {
      const payload = this.jwtService.verify<Payload>(token, {
        secret: this.configService.get<string>('REFRESH_SECRET_KEY'),
      })

      if (!payload?.sub) {
        throw new UnauthorizedException('Token inválido')
      }
      return payload
    } catch {
      throw new UnauthorizedException('Token de actualización inválido')
    }
  }
}
