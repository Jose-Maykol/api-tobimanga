import { Request, Response } from 'express'

import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { SuccessResponse } from '@/common/interfaces/api-response'
import { AuthenticatedUser } from '@/common/interfaces/authenticated-user.interface'
import { ResponseBuilder } from '@/common/utils/response.util'
import { UserAlreadyExistsException } from '@/core/domain/exceptions/user/user-already-exists.exception'
import { UserNotFoundException } from '@/core/domain/exceptions/user/user-not-found.exception'
import {
  RegisterUserUseCase,
  RegisterUserUseCaseResult,
} from '@/modules/user/application/use-cases/register-user.use-case'

import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case'
import { LogoutUserUseCase } from '../../application/use-cases/logout-user.use-case'
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case'
import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception'
import { InvalidRefreshTokenException } from '../../domain/exceptions/invalid-refresh-token.exception'
import { RefreshTokenNotFoundException } from '../../domain/exceptions/refresh-token-not-found.exception'
import { User } from '../decorators/user.decorator'
import { UserLoginDto } from '../dtos/login-user.dto'
import { RegisterUserDto } from '../dtos/register-user.dto'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { LoginSwaggerExamples } from '../swagger/login.swagger'
import { LogoutSwaggerExamples } from '../swagger/logout.swagger'
import { RefreshSwaggerExamples } from '../swagger/refresh.swagger'
import { RegisterSwaggerExamples } from '../swagger/register.swagger'

@Controller()
@ApiTags('Autenticación')
export class AuthController {
  constructor(
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private configService: ConfigService,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description:
      'Permite a un usuario autenticarse en el sistema utilizando su email y contraseña. Devuelve un access token JWT y establece una cookie httpOnly con el refresh token.',
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
      'Login exitoso. Retorna access token y datos del usuario. El refresh token se establece como cookie httpOnly.',
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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Los datos proporcionados no son válidos.',
    schema: { example: LoginSwaggerExamples.validationError },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor.',
    schema: { example: LoginSwaggerExamples.serverError },
  })
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() userLoginDto: UserLoginDto,
  ) {
    try {
      const { email, password } = userLoginDto
      const result = await this.loginUserUseCase.execute(email, password)
      const secure = this.configService.get<string>('NODE_ENV') === 'production'

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: secure,
        sameSite: 'lax',
        path: '/api/auth',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      })

      return ResponseBuilder.success({
        message: 'Login exitoso',
        data: {
          accessToken: result.accessToken,
          user: {
            id: result.user.id,
            email: result.user.email,
            username: result.user.username,
            profileImage: result.user.profileImage,
          },
        },
      })
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            error.code,
            HttpStatus.NOT_FOUND,
          ),
          HttpStatus.NOT_FOUND,
        )
      } else if (error instanceof InvalidCredentialsException) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            error.code,
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
            error.code,
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
  @ApiCookieAuth('refreshToken')
  @ApiOperation({
    summary: 'Cerrar sesión',
    description:
      'Cierra la sesión del usuario actual, invalida el refresh token y limpia la cookie.',
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
    description: 'Refresh token inválido o expirado',
    schema: { example: LogoutSwaggerExamples.invalidToken },
  })
  async logout(
    @User() user: AuthenticatedUser,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { id } = user
      const refreshToken = req.cookies['refreshToken']
      await this.logoutUserUseCase.execute(id, refreshToken)

      res.clearCookie('refreshToken', {
        path: '/api/auth',
      })

      return ResponseBuilder.success({
        message: 'Sesión cerrada exitosamente',
        data: null,
      })
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            error.code,
            HttpStatus.NOT_FOUND,
          ),
          HttpStatus.NOT_FOUND,
        )
      } else if (error instanceof RefreshTokenNotFoundException) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            error.code,
            HttpStatus.NOT_FOUND,
          ),
          HttpStatus.NOT_FOUND,
        )
      } else if (error instanceof InvalidRefreshTokenException) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            error.code,
            HttpStatus.UNAUTHORIZED,
          ),
          HttpStatus.UNAUTHORIZED,
        )
      }
      throw error
    }
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth('refreshToken')
  @ApiOperation({
    summary: 'Renovar tokens',
    description:
      'Genera un nuevo access token y refresh token usando el refresh token actual. El nuevo refresh token se establece como cookie httpOnly.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Tokens renovados exitosamente. Retorna nuevo access token y actualiza la cookie del refresh token.',
    schema: { example: RefreshSwaggerExamples.success },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado o refresh token no encontrado',
    schema: { example: RefreshSwaggerExamples.notFound },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Refresh token inválido o expirado',
    schema: { example: RefreshSwaggerExamples.invalidToken },
  })
  async refresh(
    @User() user: AuthenticatedUser,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { id } = user
      const refreshToken = req.cookies['refreshToken']
      const result = await this.refreshTokenUseCase.execute(id, refreshToken)
      const secure = this.configService.get<string>('NODE_ENV') === 'production'

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: secure,
        sameSite: 'lax',
        path: '/api/auth',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      })

      return ResponseBuilder.success({
        message: 'Sesión renovada exitosamente',
        data: {
          accessToken: result.accessToken,
        },
      })
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            error.code,
            HttpStatus.NOT_FOUND,
          ),
          HttpStatus.NOT_FOUND,
        )
      } else if (error instanceof RefreshTokenNotFoundException) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            error.code,
            HttpStatus.NOT_FOUND,
          ),
          HttpStatus.NOT_FOUND,
        )
      } else if (error instanceof InvalidRefreshTokenException) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            error.code,
            HttpStatus.UNAUTHORIZED,
          ),
          HttpStatus.UNAUTHORIZED,
        )
      }
      throw error
    }
  }
}
