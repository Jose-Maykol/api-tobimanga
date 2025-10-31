import { Inject, Injectable } from '@nestjs/common'

import { Genre } from '@/core/domain/entities/genre.entity'
import { GenreRepository } from '@/core/domain/repositories/genre.repository'
import { GENRE_REPOSITORY } from '@/infrastructure/tokens/repositories'

@Injectable()
export class GetAllGenresUseCase {
  constructor(
    @Inject(GENRE_REPOSITORY)
    private readonly genreRepository: GenreRepository,
  ) {}

  /**
   * Retrieve all genres.
   * @returns Array of Genre entities
   */
  async execute(): Promise<Genre[]> {
    return this.genreRepository.findAll()
  }
}
