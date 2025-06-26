import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
/* import { AuthMiddleware } from './auth/middleware/auth.middleware' */
import { SnakeCaseMiddleware } from './common/middleware/snake-case.middleware'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './modules/user/user.module'
import { AuthModule } from './modules/auth/auth.module'
import { RouterModule } from '@nestjs/core'

const modules = [AuthModule, UserModule]
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ...modules,
    RouterModule.register([
      {
        path: '/v2',
        children: [
          {
            module: AuthModule,
            path: 'auth',
          },
        ],
      },
    ]),
    /*     AdminModule,
    AuthModule,
    MangaModule,
    UserModule,
    CronJobModule, */
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SnakeCaseMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    })
  }
}
