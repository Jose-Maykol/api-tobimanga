import { Inject, Injectable, Logger } from '@nestjs/common'

import { Genre } from '@/core/domain/entities/genre.entity'
import { GenreNotFoundException } from '@/core/domain/exceptions/genre/genre-not-found.exception'
import { GenreRepository } from '@/core/domain/repositories/genre.repository'
import { GENRE_REPOSITORY } from '@/infrastructure/tokens/repositories'

@Injectable()
export class GetGenreByIdUseCase {
  private readonly logger = new Logger(GetGenreByIdUseCase.name)

  constructor(
    @Inject(GENRE_REPOSITORY)
    private readonly genreRepository: GenreRepository,
  ) {}

  async execute(id: string): Promise<Genre> {
    const genre = await this.genreRepository.findById(id)
    if (!genre) {
      this.logger.warn(`Genre not found with ID ${id}`)
      throw new GenreNotFoundException(id)
    }
    return genre
  }
}
