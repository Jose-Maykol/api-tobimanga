import {
  Body,
  Controller,
  HttpStatus,
  Post,
  HttpCode,
  HttpException,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { UserLoginDto } from '../dtos/login-user.dto'
import { RegisterUserDto } from '../dtos/register-user.dto'
import { LoginSwaggerExamples } from '../swagger/auth/login.swagger'
import { RegisterSwaggerExamples } from '../swagger/auth/register.swagger'
import { LogoutSwaggerExamples } from '../swagger/auth/logout.swagger'
import {
  RegisterUserUseCase,
  RegisterUserUseCaseResult,
} from '@/application/use-cases/auth/register-user.use-case'
import { LoginUserUseCase } from '@/application/use-cases/auth/login-user.use-case'
import { UserAlreadyExistsException } from '@/domain/exceptions/user-already-exists.exception'
import { ResponseBuilder } from '@/common/utils/response.util'
import { SuccessResponse } from '@/common/interfaces/api-response'
import { InvalidCredentialsException } from '@/domain/exceptions/invalid-credentials.exception'
import { LogoutUserDto } from '../dtos/logout-user.dto'
import { User } from '../decorators/user.decorator'
import { AuthenticatedUser } from '@/common/interfaces/authenticated-user.interface'
import { LogoutUserUseCase } from '@/application/use-cases/auth/logout-user.use-case'
import { UserNotFoundException } from '@/domain/exceptions/user-not-found.exception'
import { RefreshTokenNotFoundException } from '@/domain/exceptions/refresh-token-not-found.exception'
import { InvalidRefreshTokenException } from '@/domain/exceptions/invalid-refresh-token.exception'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase,
  ) {}
  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description:
      'Permite a un usuario autenticarse en el sistema utilizando su email y contraseña.',
  })
  @ApiBody({
    description: 'Credenciales del usuario',
    type: UserLoginDto,
    examples: {
      correctCredentials: {
        summary: 'Credenciales correctas',
        value: { email: 'user@example.com', password: 'password123' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Login exitoso. Retorna tokens de acceso y refresh junto con la información del usuario',
    schema: { example: LoginSwaggerExamples.success },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El usuario no existe en el sistema',
    schema: { example: LoginSwaggerExamples.notFound },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Las credenciales proporcionadas son incorrectas',
    schema: { example: LoginSwaggerExamples.unauthorized },
  })
  async login(@Body() userLoginDto: UserLoginDto) {
    try {
      const { email, password } = userLoginDto
      return this.loginUserUseCase.execute(email, password)
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw new HttpException(
          ResponseBuilder.error(error.message, error.key, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        )
      } else if (error instanceof InvalidCredentialsException) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            error.key,
            HttpStatus.UNAUTHORIZED,
          ),
          HttpStatus.UNAUTHORIZED,
        )
      }
      throw error
    }
  }
  @Post('register')
  @ApiOperation({
    summary: 'Registrar un nuevo usuario',
    description:
      'Crea una nueva cuenta de usuario en el sistema. Valida que el email no esté en uso y que los datos cumplan con los requisitos mínimos.',
  })
  @ApiBody({
    description: 'Información del nuevo usuario',
    type: RegisterUserDto,
    examples: {
      validUser: {
        summary: 'Usuario válido',
        value: {
          email: 'nuevo@example.com',
          password: 'Password123!',
          username: 'nuevoUsuario',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Usuario creado exitosamente. Retorna los datos básicos del usuario registrado.',
    schema: { example: RegisterSwaggerExamples.success },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'El email ya está registrado o los datos proporcionados no son válidos',
    schema: { example: RegisterSwaggerExamples.badRequest },
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description:
      'Los datos proporcionados no cumplen con las validaciones requeridas',
    schema: { example: RegisterSwaggerExamples.validationError },
  })
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<SuccessResponse<{ user: RegisterUserUseCaseResult }>> {
    try {
      const result = await this.registerUserUseCase.execute({
        email: registerUserDto.email,
        password: registerUserDto.password,
        username: registerUserDto.username,
      })
      return ResponseBuilder.success({
        data: {
          user: result,
        },
        message: 'Usuario registrado exitosamente',
      })
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            error.key,
            HttpStatus.BAD_REQUEST,
          ),
          HttpStatus.BAD_REQUEST,
        )
      }
      throw error
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cerrar sesión',
    description:
      'Cierra la sesión del usuario actual y revoca su refresh token.',
  })
  @ApiBody({
    description: 'refresh token a revocar',
    type: LogoutUserDto,
    examples: {
      validLogout: {
        summary: 'refresh token válido',
        value: {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sesión cerrada exitosamente',
    schema: { example: LogoutSwaggerExamples.success },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado o refresh token no encontrado',
    schema: { example: LogoutSwaggerExamples.notFound },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Refresh token inválido',
    schema: { example: LogoutSwaggerExamples.invalidToken },
  })
  async logout(
    @User() user: AuthenticatedUser,
    @Body() logoutUserDto: LogoutUserDto,
  ) {
    try {
      const { id } = user
      const { refreshToken } = logoutUserDto
      await this.logoutUserUseCase.execute(id, refreshToken)
      return ResponseBuilder.success({
        message: 'Sesión cerrada exitosamente',
        data: null,
      })
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new HttpException(
          ResponseBuilder.error(error.message, error.key, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        )
      } else if (error instanceof RefreshTokenNotFoundException) {
        throw new HttpException(
          ResponseBuilder.error(error.message, error.key, HttpStatus.NOT_FOUND),
          HttpStatus.NOT_FOUND,
        )
      } else if (error instanceof InvalidRefreshTokenException) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            error.key,
            HttpStatus.UNAUTHORIZED,
          ),
          HttpStatus.UNAUTHORIZED,
        )
      }
      throw error
    }
  }

  /* @Post('refresh')
  @ApiOperation({ summary: 'Refrescar token de acceso' })
  @ApiBody({
    description: 'refresh token para obtener un nuevo token de acceso',
    type: String,
  })
  @UsePipes(new ZodValidationPipe(refreshTokenSchema))
  async refresh(@Body() body: RefreshTokenDto) {
    const { refreshToken } = body
    const command = new RefreshTokenCommand(refreshToken)
    return await this.commandBus.execute(command)
  } */
}
