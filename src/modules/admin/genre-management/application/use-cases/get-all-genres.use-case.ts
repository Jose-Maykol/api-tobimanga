import { Inject, Injectable, Logger } from '@nestjs/common'

import { Genre } from '@/core/domain/entities/genre.entity'
import { GenreRepository } from '../../domain/repositories/genre.repository'
import { GENRE_REPOSITORY } from '@/infrastructure/tokens/repositories'

@Injectable()
export class GetAllGenresUseCase {
  private readonly logger = new Logger(GetAllGenresUseCase.name)

  constructor(
    @Inject(GENRE_REPOSITORY)
    private readonly genreRepository: GenreRepository,
  ) { }

  async execute(): Promise<Genre[]> {
    const genres = await this.genreRepository.findAll()
    this.logger.log(`Retrieved ${genres.length} genres `)
    return genres
  }
}
