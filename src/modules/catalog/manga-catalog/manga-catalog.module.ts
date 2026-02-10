import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/core/database/database.module'
import { InfrastructureModule } from '@/infrastructure/infraestructure.module'

import { FindMangaBySlugUseCase } from './application/use-cases/find-manga-by-slug.use-case'
import { ListChaptersByMangaSlugUseCase } from './application/use-cases/list-chapters-by-manga-slug.use-case'
import { ListPublicMangasUseCase } from './application/use-cases/list-public-mangas.use-case'
import { MangaCatalogRepository } from './infrastructure/repositories/manga-catalog.repository'
import { MangaCatalogController } from './interface/controllers/manga-catalog.controller'

@Module({
  imports: [InfrastructureModule, DatabaseModule],
  providers: [
    MangaCatalogRepository,
    ListPublicMangasUseCase,
    FindMangaBySlugUseCase,
    ListChaptersByMangaSlugUseCase,
  ],
  controllers: [MangaCatalogController],
  exports: [],
})
export class MangaCatalogModule {}
