import { Inject, Injectable, Logger } from '@nestjs/common'

import { GenreNotFoundException } from '@/core/domain/exceptions/genre/genre-not-found.exception'
import { GenreRepository } from '@/core/domain/repositories/genre.repository'
import { GENRE_REPOSITORY } from '@/infrastructure/tokens/repositories'

@Injectable()
export class DeleteGenreUseCase {
  private readonly logger = new Logger(DeleteGenreUseCase.name)

  constructor(
    @Inject(GENRE_REPOSITORY)
    private readonly genreRepository: GenreRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const genre = await this.genreRepository.findById(id)

    if (!genre) {
      this.logger.warn(`Genre not found with ID ${id}`)
      throw new GenreNotFoundException(id)
    }

    const deleted = await this.genreRepository.delete(id)

    if (!deleted) {
      this.logger.error(`Failed to delete genre with name ${genre.name}`)
      throw new GenreNotFoundException(id)
    }

    this.logger.log(`Genre with ID ${id} deleted successfully`)
  }
}
