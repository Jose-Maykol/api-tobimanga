import { Inject, Injectable } from '@nestjs/common'

import { IAuthorCatalogRepository } from '../../domain/repositories/author-catalog.repository'
import { AUTHOR_CATALOG_REPOSITORY } from '../../infrastructure/tokens'

@Injectable()
export class ListAuthorsUseCase {
  constructor(
    @Inject(AUTHOR_CATALOG_REPOSITORY)
    private readonly authorCatalogRepository: IAuthorCatalogRepository,
  ) {}

  async execute() {
    return this.authorCatalogRepository.findAll()
  }
}
