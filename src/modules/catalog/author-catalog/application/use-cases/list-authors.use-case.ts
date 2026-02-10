import { Inject, Injectable } from '@nestjs/common'

import { AuthorCatalogRepository } from '../../infrastructure/repositories/author-catalog.repository'

@Injectable()
export class ListAuthorsUseCase {
  constructor(
    @Inject()
    private readonly authorCatalogRepository: AuthorCatalogRepository,
  ) {}

  async execute() {
    return this.authorCatalogRepository.findAll()
  }
}
