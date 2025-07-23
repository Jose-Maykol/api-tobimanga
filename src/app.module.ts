import { Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './modules/user/user.module'
import { AuthModule } from './modules/auth/auth.module'
import { RouterModule } from '@nestjs/core'
import { DemographicModule } from './modules/demographic/demographic.module'
import { AuthorModule } from './modules/author/author.module'
import { GenreModule } from './modules/genres/genre.module'

const modules = [
  AuthModule,
  UserModule,
  DemographicModule,
  AuthorModule,
  GenreModule,
]
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ...modules,
    RouterModule.register([
      {
        module: AuthModule,
        path: 'auth',
      },
      {
        module: DemographicModule,
        path: 'demographics',
      },
      {
        module: AuthorModule,
        path: 'authors',
      },
      {
        module: GenreModule,
        path: 'genres',
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(/* consumer: MiddlewareConsumer */) {
    //* Middleware desactivado temporalmente
    /* consumer.apply(SnakeCaseMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    }) */
  }
}
