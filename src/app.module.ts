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
import { DatabaseModule } from './modules/database/database.module'
import { ConfigModule } from '@nestjs/config'
import { RouterModule } from '@nestjs/core'
import { UserModule } from './modules/v2/user/user.module'
import { AuthModule } from './modules/v2/auth/auth.module'
/* import { MangaModule } from './modules/v1/manga/manga.module'
import { AuthModule } from './modules/v1/auth/auth.module'
import { UserModule } from './modules/v1/user/user.module'
import { AdminModule } from './modules/v1/admin/admin.module'
import { CronJobModule } from './modules/v1/cron-jobs/cron-job.module' */

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CloudinaryModule,
    DatabaseModule,
    RouterModule.register([
      /* {
        path: '/v1',
        children: [
          {
            module: AdminModule,
            path: 'admin',
          },
          {
            module: AuthModule,
            path: 'auth',
          },
          {
            module: MangaModule,
            path: 'mangas',
          },
          {
            module: UserModule,
            path: 'users',
          },
          {
            module: CronJobModule,
            path: 'cron-jobs',
          },
        ],
      }, */
      {
        path: '/v2',
        children: [
          {
            module: AuthModule,
            path: 'auth',
          },
          {
            module: UserModule,
            path: 'users',
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
  providers: [AppService, JwtService],
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
