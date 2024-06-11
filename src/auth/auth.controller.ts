import { Body, Controller, NotFoundException, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterUserDto } from './dto/register-user.dto'
import { LoginUserDto } from './dto/login-user.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto
    const user = await this.authService.findOne(email)
    if (!user) {
      throw new NotFoundException('Usuario no encontrado')
    }
    if (!(await this.authService.validate(user, password))) {
      throw new NotFoundException('Contraseña incorrecta')
    }
    const { access_token } = await this.authService.login(user)
    return {
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profile_image: user.profile_image_url,
      },
      access_token,
    }
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const userExists = await this.authService.findOne(registerUserDto.email)
    if (userExists) {
      throw new NotFoundException('Este email ya esta registrado')
    }
    const user = await this.authService.register(registerUserDto)
    return {
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    }
  }
}
