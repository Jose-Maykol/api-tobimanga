// application/use-cases/login-user.use-case.ts
import { UserService } from '@/modules/v2/user/application/services/user.service'
import { AuthService } from '../services/auth.service'
import { NotFoundException, UnauthorizedException } from '@nestjs/common'
import { ApiResponse } from '@/common/utils/response.util'

export class LoginUserUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userService.findByEmail(email)
    if (!user) throw new NotFoundException('Usuario no encontrado')

    const isPasswordValid = await this.authService.comparePasswords(
      password,
      user.password,
    )

    if (!isPasswordValid)
      throw new UnauthorizedException('Credenciales incorrectas')

    const tokens = await this.authService.generateTokens(user.id, user.email)

    await this.userService.updateRefreshToken(user.id, tokens.refreshToken)

    return ApiResponse.success({
      message: 'Inicio de sesión exitoso',
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          profileImage: user.profileImage,
        },
      },
    })
  }
}
