import { Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RouterModule } from '@nestjs/core'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { AuthorModule } from './modules/author/author.module'
import { DemographicModule } from './modules/demographic/demographic.module'
import { GenreModule } from './modules/genres/genre.module'
import { MangaModule } from './modules/manga/manga.module'
import { UserModule } from './modules/user/user.module'

const modules = [
  AuthModule,
  UserModule,
  DemographicModule,
  AuthorModule,
  GenreModule,
  MangaModule,
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
      {
        module: MangaModule,
        path: 'mangas',
      },
    ]),
    /* RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
        children: [
          { path: 'mangas', module: MangaManagementModule },
          { path: 'authors', module: AuthorManagementModule },
          { path: 'genres', module: GenreManagementModule },
          { path: 'users', module: UserManagementModule },
        ],
      },
    ]), */
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
