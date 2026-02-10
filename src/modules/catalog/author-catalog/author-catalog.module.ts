import { Module } from '@nestjs/common'

import { ListAuthorsUseCase } from './application/use-cases/list-authors.use-case'
import { AuthorCatalogRepository } from './infrastructure/repositories/author-catalog.repository'
import { AuthorCatalogController } from './interface/controllers/author-catalog.controller'

@Module({
  controllers: [AuthorCatalogController],
  providers: [ListAuthorsUseCase, AuthorCatalogRepository],
  exports: [ListAuthorsUseCase],
})
export class AuthorCatalogModule {}
