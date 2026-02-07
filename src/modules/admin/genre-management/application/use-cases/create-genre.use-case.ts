import { Inject, Injectable, Logger } from '@nestjs/common'

import { Genre } from '@/core/domain/entities/genre.entity'
import { GenreAlreadyExistsException } from '@/core/domain/exceptions/genre/genre-already-exists.exception'
import { GenreRepository } from '@/core/domain/repositories/genre.repository'
import { GENRE_REPOSITORY } from '@/infrastructure/tokens/repositories'

import { CreateGenreDto } from '../dtos/create-genre.dto'

@Injectable()
export class CreateGenreUseCase {
  private readonly logger = new Logger(CreateGenreUseCase.name)

  constructor(
    @Inject(GENRE_REPOSITORY)
    private readonly genreRepository: GenreRepository,
  ) {}

  async execute(params: CreateGenreDto): Promise<Genre> {
    const existingGenre = await this.genreRepository.findByName(params.name)
    if (existingGenre) {
      this.logger.warn(
        `Creation failed: Genre name already exists: ${params.name}`,
      )
      throw new GenreAlreadyExistsException(params.name)
    }

    const genre: Genre = {
      id: crypto.randomUUID(),
      name: params.name,
      createdAt: new Date(),
      updatedAt: null,
    }

    const createdGenre = await this.genreRepository.save(genre)
    this.logger.log(
      `Genre created successfully. Name: ${createdGenre.name}, ID: ${createdGenre.id}`,
    )
    return createdGenre
  }
}
