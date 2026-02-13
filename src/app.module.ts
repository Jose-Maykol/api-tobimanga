import { Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RouterModule } from '@nestjs/core'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AdminModule } from './modules/admin/admin.module'
import { AuthorManagementModule } from './modules/admin/author-management/author-management.module'
import { DemographicManagementModule } from './modules/admin/demographic-management/demographic-management.module'
import { GenreManagementModule } from './modules/admin/genre-management/genre-management.module'
import { MangaManagementModule } from './modules/admin/manga-management/manga-management.module'
import { UploadModule } from './modules/admin/upload/upload.module'
import { AuthModule } from './modules/auth/auth.module'
import { CatalogModule } from './modules/catalog/catalog.module'
import { MangaCatalogModule } from './modules/catalog/manga-catalog/manga-catalog.module'
import { UserContentModule } from './modules/user-content/user-content.module'

const modules = [
  AuthModule,
  AdminModule,
  MangaManagementModule,
  GenreManagementModule,
  DemographicManagementModule,
  AuthorManagementModule,
  UploadModule,
  CatalogModule,
  MangaCatalogModule,
  UserContentModule,
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
          {
            module: AuthorManagementModule,
            path: 'authors',
          },
          {
            module: UploadModule,
            path: 'uploads',
          },
        ],
      },
      {
        module: AuthModule,
        path: 'auth',
      },
      {
        module: CatalogModule,
        path: '',
        children: [
          {
            module: MangaCatalogModule,
            path: 'mangas',
          },
        ],
      },
      {
        module: UserContentModule,
        path: 'user',
        children: [],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure() {}
}
