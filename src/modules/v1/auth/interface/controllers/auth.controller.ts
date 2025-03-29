import { Body, Controller, HttpStatus, Post, UsePipes } from '@nestjs/common'
import { RegisterUserDto, registerUserSchema, RegisterUserSwaggerDto } from '../dto/register-user.dto'
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { RegisterUserCommand } from '../../application/commands/register-user.command'
import { UserLoginQuery } from '../../application/queries/login-user.query'
import { UserLoginDto, userLoginSchema, UserLoginSwaggerDto } from '../dto/login-user.dto'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Autenticación')
@Controller()
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({
    description: 'Datos necesarios para iniciar sesión',
    type: UserLoginSwaggerDto,
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
  @UsePipes(new ZodValidationPipe(userLoginSchema))
  async login(@Body() userLoginDto: UserLoginDto) {
    const { email, password } = userLoginDto
    const command = new UserLoginQuery(email, password)
    return await this.queryBus.execute(command)
  }

  @Post('register')
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
  }
}
