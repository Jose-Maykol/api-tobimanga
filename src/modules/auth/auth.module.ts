import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { DatabaseModule } from '@/core/database/database.module'

import { JwtStrategy } from './application/strategies/jwt.strategy'
import { GetUserByEmailUseCase } from './application/use-cases/get-user-by-email.use-case'
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case'
import { LoginUserUseCase } from './application/use-cases/login-user.use-case'
import { LogoutUserUseCase } from './application/use-cases/logout-user.use-case'
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case'
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case'
import { UserRepositoryImpl } from './infrastructure/repositories/auth-user.repository.impl'
import { AccessTokenServiceImpl } from './infrastructure/services/access-token.service.impl'
import { PasswordHashingServiceImpl } from './infrastructure/services/password-hashing.service.impl'
import { RefreshTokenServiceImpl } from './infrastructure/services/refresh-token.service.impl'
import { AuthController } from './interface/controllers/auth.controller'

const useCases = [
  LoginUserUseCase,
  RegisterUserUseCase,
  LogoutUserUseCase,
  RefreshTokenUseCase,
  GetUserByIdUseCase,
  GetUserByEmailUseCase,
]

const repositories = [
  {
    provide: 'UserRepository',
    useClass: UserRepositoryImpl,
  },
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
  {
    provide: 'PasswordHashingService',
    useClass: PasswordHashingServiceImpl,
  },
]

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    JwtService,
    JwtStrategy,
    ...useCases,
    ...repositories,
    ...services,
  ],
  exports: [JwtService, JwtStrategy, GetUserByIdUseCase, GetUserByEmailUseCase],
})
export class AuthModule {}
