import { Inject, Injectable } from '@nestjs/common'

import { Genre } from '@/core/domain/entities/genre.entity'
import { GenreAlreadyExistsException } from '@/core/domain/exceptions/genre/genre-already-exists.exception'
import { GenreRepository } from '@/core/domain/repositories/genre.repository'
import { GENRE_REPOSITORY } from '@/infrastructure/tokens/repositories'

import { CreateGenreDto } from '../dtos/create-genre.dto'

@Injectable()
export class CreateGenreUseCase {
  constructor(
    @Inject(GENRE_REPOSITORY)
    private readonly genreRepository: GenreRepository,
  ) {}

  /**
   * Create a new genre if it does not already exist.
   * @param params Data required to create a genre
   * @returns The created Genre entity
   * @throws GenreAlreadyExistsException if a genre with the same name exists
   */
  async execute(params: CreateGenreDto): Promise<Genre> {
    const existingGenre = await this.genreRepository.findByName(params.name)
    if (existingGenre) {
      throw new GenreAlreadyExistsException(params.name)
    }

    const genre: Genre = {
      id: crypto.randomUUID(),
      name: params.name,
      createdAt: new Date(),
      updatedAt: null,
    }

    return this.genreRepository.save(genre)
  }
}
