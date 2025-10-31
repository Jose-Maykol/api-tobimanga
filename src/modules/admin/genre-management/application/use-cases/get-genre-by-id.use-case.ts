import { Inject, Injectable } from '@nestjs/common'

import { Genre } from '@/core/domain/entities/genre.entity'
import { GenreNotFoundException } from '@/core/domain/exceptions/genre/genre-not-found.exception'
import { GenreRepository } from '@/core/domain/repositories/genre.repository'
import { GENRE_REPOSITORY } from '@/infrastructure/tokens/repositories'

@Injectable()
export class GetGenreByIdUseCase {
  constructor(
    @Inject(GENRE_REPOSITORY)
    private readonly genreRepository: GenreRepository,
  ) {}

  /**
   * Retrieve a genre by its ID.
   * @param id Genre identifier
   * @returns Genre entity
   * @throws GenreNotFoundException if genre is not found
   */
  async execute(id: string): Promise<Genre> {
    const genre = await this.genreRepository.findById(id)
    if (!genre) {
      throw new GenreNotFoundException(id)
    }
    return genre
  }
}
