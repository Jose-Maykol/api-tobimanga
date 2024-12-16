import { DatabaseModule } from '@/modules/database/database.module'
import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { UserFactory } from './domain/factories/user.factory'
import { UserRepositoryImpl } from './infrastructure/repositories/user.repository.impl'
import { RegisterUserHandler } from './application/commands/handlers/register-user.handler'
import { UserLoginHandler } from './application/queries/handlers/user-login.handler'
import { CheckUserExistsQuery } from './application/queries/check-user-exists.query'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthMiddleware } from './interface/middlewares/auth.middleware'
import { AuthController } from './interface/controllers/auth.controller'

const CommandHandlers = [RegisterUserHandler]
const QueryHandlers = [UserLoginHandler, CheckUserExistsQuery]
const Factories = [UserFactory]
const Repositories = [
  { provide: 'UserRepository', useClass: UserRepositoryImpl },
]

@Module({
  imports: [
    CqrsModule,
    DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET_KEY'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    DrizzleService,
    AuthMiddleware,
    ...CommandHandlers,
    ...QueryHandlers,
    ...Factories,
    ...Repositories,
  ],
})
export class AuthModule {}
