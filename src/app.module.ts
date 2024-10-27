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
import { MangasModule } from './mangas/mangas.module'
import { AuthModule } from './auth/auth.module'
import { AuthMiddleware } from './auth/middleware/auth.middleware'
import { UserModule } from './user/user.module'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { ChaptersModule } from './chapters/chapters.module'
import { SnakeCaseMiddleware } from './common/middleware/snake-case.middleware'
import { CloudinaryModule } from './cloudinary/cloudinary.module'
import { GenresModule } from './genres/genres.module'
import { AuthorsModule } from './authors/authors.module'
import { DemographicsModule } from './demographics/demographics.module'
import { PermissiveAuthMiddleware } from './auth/middleware/permissive-auth.middleware'
import { DatabaseModule } from './modules/database/database.module'
import { ConfigModule } from '@nestjs/config'
import { MangaModule } from './modules/v1/manga/manga.module'

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
    AuthModule,
    MangasModule,
    UserModule,
    ChaptersModule,
    CloudinaryModule,
    GenresModule,
    AuthorsModule,
    DemographicsModule,
    MangaModule,
    DatabaseModule,
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
