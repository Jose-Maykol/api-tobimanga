import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/core/database/database.module'
import { MangaFactory } from '@/core/domain/factories/manga/manga.factory'
import { StorageModule } from '@/core/storage/storage.module'
import { InfrastructureModule } from '@/infrastructure/infraestructure.module'
import { AuthorManagementModule } from '@/modules/admin/author-management/author-management.module'
import { AuthModule } from '@/modules/auth/auth.module'

import { DemographicManagementModule } from '../demographic-management/demographic-management.module'
import { GenreManagementModule } from '../genre-management/genre-management.module'
import { CreateMangaUseCase } from './application/use-cases/create-manga.use-case'
import { MangaManagementController } from './interface/controllers/manga-management.controller'

@Module({
  imports: [
    InfrastructureModule,
    DatabaseModule,
    StorageModule,
    AuthModule,
    GenreManagementModule,
    DemographicManagementModule,
    AuthorManagementModule,
  ],
  providers: [CreateMangaUseCase, MangaFactory],
  controllers: [MangaManagementController],
  exports: [CreateMangaUseCase],
})
export class MangaManagementModule {}
