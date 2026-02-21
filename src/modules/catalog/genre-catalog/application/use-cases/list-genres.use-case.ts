import { Inject, Injectable } from '@nestjs/common'

import { IGenreCatalogRepository } from '../../domain/repositories/genre-catalog.repository'
import { GENRE_CATALOG_REPOSITORY } from '../../infrastructure/tokens'

@Injectable()
export class ListGenresUseCase {
  constructor(
    @Inject(GENRE_CATALOG_REPOSITORY)
    private readonly genreCatalogRepository: IGenreCatalogRepository,
  ) {}

  async execute() {
    return this.genreCatalogRepository.findAll()
  }
}
