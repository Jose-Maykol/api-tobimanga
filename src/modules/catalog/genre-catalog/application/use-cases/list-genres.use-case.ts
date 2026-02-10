import { Inject, Injectable } from '@nestjs/common'

import { GenreCatalogRepository } from '../../infrastructure/repositories/genre-catalog.repository'

@Injectable()
export class ListGenresUseCase {
  constructor(
    @Inject()
    private readonly genreCatalogRepository: GenreCatalogRepository,
  ) {}

  async execute() {
    return this.genreCatalogRepository.findAll()
  }
}
