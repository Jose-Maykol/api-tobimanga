import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { RegisterUserUseCase } from '../user/application/use-cases/register-user.use-case'
import { UserModule } from '../user/user.module'
import { JwtStrategy } from './application/strategies/jwt.strategy'
import { LoginUserUseCase } from './application/use-cases/login-user.use-case'
import { LogoutUserUseCase } from './application/use-cases/logout-user.use-case'
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case'
import { AccessTokenServiceImpl } from './infrastructure/services/access-token.service.impl'
import { RefreshTokenServiceImpl } from './infrastructure/services/refresh-token.service.impl'
import { AuthController } from './interface/controllers/auth.controller'

const useCases = [
  LoginUserUseCase,
  RegisterUserUseCase,
  LogoutUserUseCase,
  RefreshTokenUseCase,
]

const services = [
  {
    provide: 'AccessTokenService',
    useClass: AccessTokenServiceImpl,
  },
  {
    provide: 'RefreshTokenService',
    useClass: RefreshTokenServiceImpl,
  },
]

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [JwtService, ...useCases, ...services, JwtStrategy],
  exports: [],
})
export class AuthModule {}
