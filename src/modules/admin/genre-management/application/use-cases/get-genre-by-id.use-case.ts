import { Inject, Injectable, Logger } from '@nestjs/common'

import { GenreNotFoundException } from '@/modules/admin/genre-management/domain/exceptions/genre-not-found.exception'

import { Genre } from '../../domain/entities/genre.entity'
import { GenreRepository } from '../../domain/repositories/genre.repository'
import { GENRE_REPOSITORY } from '../../domain/tokens'

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
