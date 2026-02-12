import { Module } from '@nestjs/common'

import { ListAuthorsUseCase } from './application/use-cases/list-authors.use-case'
import { AuthorCatalogRepositoryImpl } from './infrastructure/repositories/author-catalog.repository.impl'
import { AUTHOR_CATALOG_REPOSITORY } from './infrastructure/tokens'
import { AuthorCatalogController } from './interface/controllers/author-catalog.controller'

@Module({
  controllers: [AuthorCatalogController],
  providers: [
    ListAuthorsUseCase,
    {
      provide: AUTHOR_CATALOG_REPOSITORY,
      useClass: AuthorCatalogRepositoryImpl,
    },
  ],
  exports: [ListAuthorsUseCase],
})
export class AuthorCatalogModule {}
