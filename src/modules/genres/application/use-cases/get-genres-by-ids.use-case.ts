import { Inject, Injectable } from '@nestjs/common'

import { GenreNotFoundException } from '@/core/domain/exceptions/genre/genre-not-found.exception'
import { GenreRepository } from '@/core/domain/repositories/genre.repository'

import { Genre } from '../../../../core/domain/entities/genre.entity'

@Injectable()
export class GetGenresByIdsUseCase {
  constructor(
    @Inject('GenreRepository')
    private readonly genreRepository: GenreRepository,
  ) {}

  async execute(ids: string[]): Promise<Genre[]> {
    const genres = await this.genreRepository.findByIds(ids)
    const firstMissingGenre = genres.find((genre) => !ids.includes(genre.id))

    if (firstMissingGenre) {
      throw new GenreNotFoundException(firstMissingGenre.name)
    }

    return genres
  }
}
