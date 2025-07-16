import { Inject, Injectable } from '@nestjs/common'
import { GenreRepository } from '../../domain/repositories/genre.repository'
import { Genre } from '../../domain/entities/genre.entity'
import { GenreNotFoundException } from '../../domain/exceptions/genre-not-found.exception'

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
