import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/core/database/database.module'

// import { InfrastructureModule } from '@/infrastructure/infrastructure.module'
import { FindMangaBySlugUseCase } from './application/use-cases/find-manga-by-slug.use-case'
import { ListChaptersByMangaSlugUseCase } from './application/use-cases/list-chapters-by-manga-slug.use-case'
import { ListPublicMangasUseCase } from './application/use-cases/list-public-mangas.use-case'
import { MangaCatalogRepositoryImpl } from './infrastructure/repositories/manga-catalog.repository.impl'
import { MANGA_CATALOG_REPOSITORY } from './infrastructure/tokens'
import { MangaCatalogController } from './interface/controllers/manga-catalog.controller'

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: MANGA_CATALOG_REPOSITORY,
      useClass: MangaCatalogRepositoryImpl,
    },
    ListPublicMangasUseCase,
    FindMangaBySlugUseCase,
    ListChaptersByMangaSlugUseCase,
  ],
  controllers: [MangaCatalogController],
  exports: [],
})
export class MangaCatalogModule {}
