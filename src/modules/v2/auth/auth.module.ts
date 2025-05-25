import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './application/strategies/jwt.strategy'
import { JwtRefreshStrategy } from './application/strategies/jwt-refresh.strategy'
import { AuthController } from './presentation/controllers/auth.controller'
import { DatabaseModule } from '@/modules/database/database.module'
import { LoginUserUseCase } from './application/use-cases/user-login.use-case'
import { UserModule } from '../user/user.module'

const Repositories = []
const UseCases = [LoginUserUseCase]

@Module({
  imports: [CqrsModule, DatabaseModule, PassportModule, UserModule],
  controllers: [AuthController],
  providers: [JwtStrategy, JwtRefreshStrategy, ...Repositories, ...UseCases],
})
export class AuthModule {}
