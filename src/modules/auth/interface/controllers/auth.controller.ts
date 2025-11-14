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
import { Logger } from '@nestjs/common'
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
import { AuthSwagger } from '../swagger/auth.swagger'

@Controller()
@ApiTags('Autenticación')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

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
  @ApiBody(AuthSwagger.login.body)
  @ApiResponse(AuthSwagger.login.responses.ok)
  @ApiResponse(AuthSwagger.login.responses.notFound)
  @ApiResponse(AuthSwagger.login.responses.unauthorized)
  @ApiResponse(AuthSwagger.login.responses.badRequest)
  @ApiResponse(AuthSwagger.login.responses.serverError)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() userLoginDto: UserLoginDto,
  ) {
    try {
      const { email, password } = userLoginDto

      this.logger.log(`Login endpoint called for email: ${email}`)

      const result = await this.loginUserUseCase.execute(email, password)
      const secure = this.configService.get<string>('NODE_ENV') === 'production'

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: secure,
        sameSite: 'lax',
        path: '/api/auth',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      })

      this.logger.log(
        `Login successful for userId: ${result.user.id}, email: ${email}`,
      )

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
      this.logger.warn(
        `Login failed for email: ${userLoginDto.email} - ${error.message}`,
      )

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
  @ApiBody(AuthSwagger.register.body)
  @ApiResponse(AuthSwagger.register.responses.created)
  @ApiResponse(AuthSwagger.register.responses.badRequest)
  @ApiResponse(AuthSwagger.register.responses.validationError)
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<SuccessResponse<{ user: RegisterUserUseCaseResult }>> {
    try {
      this.logger.log(
        `Register endpoint called for email: ${registerUserDto.email}`,
      )

      const result = await this.registerUserUseCase.execute({
        email: registerUserDto.email,
        password: registerUserDto.password,
        username: registerUserDto.username,
      })

      this.logger.log(`User registered successfully: ${result.id}`)

      return ResponseBuilder.success({
        data: {
          user: result,
        },
        message: 'Usuario registrado exitosamente',
      })
    } catch (error) {
      this.logger.warn(
        `Register failed for email: ${registerUserDto.email} - ${error.message}`,
      )

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
  @ApiResponse(AuthSwagger.logout.responses.ok)
  @ApiResponse(AuthSwagger.logout.responses.notFound)
  @ApiResponse(AuthSwagger.logout.responses.unauthorized)
  async logout(
    @User() user: AuthenticatedUser,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { id } = user
      const refreshToken = req.cookies['refreshToken']

      this.logger.log(`Logout endpoint called for userId: ${id}`)

      await this.logoutUserUseCase.execute(id, refreshToken)

      res.clearCookie('refreshToken', {
        path: '/api/auth',
      })

      this.logger.log(`Logout successful for userId: ${id}`)

      return ResponseBuilder.success({
        message: 'Sesión cerrada exitosamente',
        data: null,
      })
    } catch (error) {
      this.logger.warn(
        `Logout failed for userId: ${user?.id} - ${error.message}`,
      )

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
  @ApiResponse(AuthSwagger.refresh.responses.ok)
  @ApiResponse(AuthSwagger.refresh.responses.notFound)
  @ApiResponse(AuthSwagger.refresh.responses.unauthorized)
  async refresh(
    @User() user: AuthenticatedUser,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { id } = user
      const refreshToken = req.cookies['refreshToken']

      this.logger.log(`Refresh endpoint called for userId: ${id}`)

      const result = await this.refreshTokenUseCase.execute(id, refreshToken)
      const secure = this.configService.get<string>('NODE_ENV') === 'production'

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: secure,
        sameSite: 'lax',
        path: '/api/auth',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      })

      this.logger.log(`Token refresh successful for userId: ${id}`)

      return ResponseBuilder.success({
        message: 'Sesión renovada exitosamente',
        data: {
          accessToken: result.accessToken,
        },
      })
    } catch (error) {
      this.logger.warn(
        `Token refresh failed for userId: ${user?.id} - ${error.message}`,
      )

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
