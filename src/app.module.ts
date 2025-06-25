import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
/* import { AuthMiddleware } from './auth/middleware/auth.middleware' */
import { JwtService } from '@nestjs/jwt'
import { SnakeCaseMiddleware } from './common/middleware/snake-case.middleware'
import { CloudinaryModule } from './cloudinary/cloudinary.module'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './infaestructure/database/database.module'
import { AuthController } from './interface/controllers/auth.controller'
import { LoginUserUseCase } from './application/use-cases/auth/login-user.use-case'
import { UserRepositoryImpl } from './infaestructure/repositories/user.repository.impl'
import { RegisterUserUseCase } from './application/use-cases/auth/register-user.use-case'
import { LogoutUserUseCase } from './application/use-cases/auth/logout-user.use-case'
import { JwtStrategy } from './application/strategies/jwt.strategy'
import { RefreshTokenUseCase } from './application/use-cases/auth/refresh-token.use-case'
import { AccessTokenServiceImpl } from './infrastructure/services/access-token.service.impl'
import { RefreshTokenServiceImpl } from './infrastructure/services/refresh-token.service.impl'
/* import { MangaModule } from './modules/v1/manga/manga.module'
import { AuthModule } from './modules/v1/auth/auth.module'
import { UserModule } from './modules/v1/user/user.module'
import { AdminModule } from './modules/v1/admin/admin.module'
import { CronJobModule } from './modules/v1/cron-jobs/cron-job.module' */

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

const repositories = [
  {
    provide: 'UserRepository',
    useClass: UserRepositoryImpl,
  },
]

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CloudinaryModule,
    DatabaseModule,
    /*     AdminModule,
    AuthModule,
    MangaModule,
    UserModule,
    CronJobModule, */
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    JwtService,
    ...services,
    ...useCases,
    ...repositories,
    JwtStrategy,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    /* consumer.apply(AuthMiddleware).forRoutes({
      path: '/user/*',
      method: RequestMethod.ALL,
    }) */

    consumer.apply(SnakeCaseMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    })
  }
}
