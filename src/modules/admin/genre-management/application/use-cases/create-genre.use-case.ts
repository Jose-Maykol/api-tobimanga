import { Inject, Injectable, Logger } from '@nestjs/common'

import { GenreAlreadyExistsException } from '@/modules/admin/genre-management/domain/exceptions/genre-already-exists.exception'

import { Genre } from '../../domain/entities/genre.entity'
import { GenreRepository } from '../../domain/repositories/genre.repository'
import { GENRE_REPOSITORY } from '../../infrastructure/tokens'
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
        `Creation failed, genre with name ${params.name} already exists`,
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
      `Genre created successfully with name ${createdGenre.name} and ID ${createdGenre.id}`,
    )
    return createdGenre
  }
}
