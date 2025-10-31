import { Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RouterModule } from '@nestjs/core'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AdminModule } from './modules/admin/admin.module'
import { DemographicManagementModule } from './modules/admin/demographic-management/demographic-management.module'
import { GenreManagementModule } from './modules/admin/genre-management/genre-management.module'
import { MangaManagementModule } from './modules/admin/manga-management/manga-management.module'
import { AuthModule } from './modules/auth/auth.module'
import { AuthorModule } from './modules/author/author.module'
import { UserModule } from './modules/user/user.module'

const modules = [
  AuthModule,
  UserModule,
  AuthorModule,
  AdminModule,
  MangaManagementModule,
]
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ...modules,
    RouterModule.register([
      {
        module: AdminModule,
        path: 'admin',
        children: [
          {
            module: MangaManagementModule,
            path: 'mangas',
          },
          {
            module: GenreManagementModule,
            path: 'genres',
          },
          {
            module: DemographicManagementModule,
            path: 'demographics',
          },
          /* { path: 'authors', module: AuthorManagementModule },
          { path: 'genres', module: GenreManagementModule },
          { path: 'users', module: UserManagementModule }, */
        ],
      },
      {
        module: AuthModule,
        path: 'auth',
      },
      {
        module: AuthorModule,
        path: 'authors',
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
