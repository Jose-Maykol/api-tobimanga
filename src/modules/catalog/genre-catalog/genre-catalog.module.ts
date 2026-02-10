import { Module } from '@nestjs/common'

import { ListGenresUseCase } from './application/use-cases/list-genres.use-case'
import { GenreCatalogRepository } from './infrastructure/repositories/genre-catalog.repository'
import { GenreCatalogController } from './interface/controllers/genre-catalog.controller'

@Module({
  controllers: [GenreCatalogController],
  providers: [ListGenresUseCase, GenreCatalogRepository],
  exports: [ListGenresUseCase],
})
export class GenreCatalogModule {}
