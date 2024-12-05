import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { configService } from './config/config.service'
import { AuthMiddleware } from './auth/middleware/auth.middleware'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { SnakeCaseMiddleware } from './common/middleware/snake-case.middleware'
import { CloudinaryModule } from './cloudinary/cloudinary.module'
import { PermissiveAuthMiddleware } from './auth/middleware/permissive-auth.middleware'
import { DatabaseModule } from './modules/database/database.module'
import { ConfigModule } from '@nestjs/config'
import { MangaModule } from './modules/v1/manga/manga.module'
import { RouterModule } from '@nestjs/core'
import { AuthModule } from './modules/v1/auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    JwtModule.register({
      secret: configService.getSecretKey(),
      signOptions: { expiresIn: '1d' },
    }),
    CloudinaryModule,
    DatabaseModule,
    RouterModule.register([
      {
        path: '/v1',
        children: [
          {
            module: AuthModule,
            path: 'auth',
          },
          {
            module: MangaModule,
            path: 'mangas',
          },
        ],
      },
    ]),
    AuthModule,
    MangaModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, AuthMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '/user/*',
      method: RequestMethod.ALL,
    })

    consumer.apply(SnakeCaseMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    })
    consumer.apply(PermissiveAuthMiddleware).forRoutes({
      path: '/mangas/:slug',
      method: RequestMethod.GET,
    })
  }
}
