import { Module } from '@nestjs/common'

import { ListGenresUseCase } from './application/use-cases/list-genres.use-case'
import { GenreCatalogRepositoryImpl } from './infrastructure/repositories/genre-catalog.repository.impl'
import { GENRE_CATALOG_REPOSITORY } from './infrastructure/tokens'
import { GenreCatalogController } from './interface/controllers/genre-catalog.controller'

@Module({
  controllers: [GenreCatalogController],
  providers: [
    ListGenresUseCase,
    { provide: GENRE_CATALOG_REPOSITORY, useClass: GenreCatalogRepositoryImpl },
  ],
  exports: [ListGenresUseCase],
})
export class GenreCatalogModule {}
