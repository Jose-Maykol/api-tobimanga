import { Body, Controller, HttpStatus, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserLoginDto } from '../dtos/login-user.dto'
import { LoginUserUseCase } from '../../application/use-cases/user-login.use-case'

@ApiTags('Autenticación')
@Controller()
export class AuthController {
  constructor(private readonly loginUserUseCase: LoginUserUseCase) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({
    description: 'Datos necesarios para iniciar sesión',
    type: UserLoginDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login exitoso',
    schema: {
      example: {
        message: 'Login exitoso',
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30',
        user: {
          id: '12345',
          email: 'user@example.com',
          username: 'usuario123',
          profileImage: 'https://url-to-profile-image.com/img.png',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado o contraseña incorrecta',
    schema: {
      example: {
        statusCode: 404,
        message: 'Usuario no encontrado',
        error: 'Not Found',
      },
    },
  })
  async login(@Body() userLoginDto: UserLoginDto) {
    const { email, password } = userLoginDto
    return this.loginUserUseCase.execute(email, password)
    /* const command = new UserLoginQuery(email, password)
    return await this.queryBus.execute(command) */
  }

  /* @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({
    description: 'Datos necesarios para registrar un usuario',
    type: RegisterUserSwaggerDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario registrado exitosamente',
    schema: {
      example: {
        message: 'Usuario creado con exito',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'El usuario ya existe o datos inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: 'Este usuario ya existe',
        error: 'Bad Request',
      },
    },
  })
  @UsePipes(new ZodValidationPipe(registerUserSchema))
  async register(@Body() registerUserDto: RegisterUserDto) {
    const command = new RegisterUserCommand(registerUserDto)
    return await this.commandBus.execute(command)
  } */

  /* @Post('refresh')
  @ApiOperation({ summary: 'Refrescar token de acceso' })
  @ApiBody({
    description: 'Token de refresco para obtener un nuevo token de acceso',
    type: String,
  })
  @UsePipes(new ZodValidationPipe(refreshTokenSchema))
  async refresh(@Body() body: RefreshTokenDto) {
    const { refreshToken } = body
    const command = new RefreshTokenCommand(refreshToken)
    return await this.commandBus.execute(command)
  } */
}
