import { Inject, Injectable, Logger } from '@nestjs/common'

import { Genre } from '@/core/domain/entities/genre.entity'
import { GenreAlreadyExistsException } from '@/core/domain/exceptions/genre/genre-already-exists.exception'
import { GenreNotFoundException } from '@/core/domain/exceptions/genre/genre-not-found.exception'
import { GenreRepository } from '@/core/domain/repositories/genre.repository'
import { GENRE_REPOSITORY } from '@/infrastructure/tokens/repositories'

import { UpdateGenreDto } from '../dtos/update-genre.dto'

@Injectable()
export class UpdateGenreUseCase {
  private readonly logger = new Logger(UpdateGenreUseCase.name)

  constructor(
    @Inject(GENRE_REPOSITORY)
    private readonly genreRepository: GenreRepository,
  ) {}

  async execute(id: string, params: UpdateGenreDto): Promise<Genre> {
    const currentGenre = await this.genreRepository.findById(id)

    if (!currentGenre) {
      this.logger.warn(`Update failed: Genre not found with ID: ${id}`)
      throw new GenreNotFoundException(id)
    }

    if (params.name !== currentGenre.name) {
      const nameExists = await this.genreRepository.findByName(params.name)
      if (nameExists) {
        this.logger.warn(
          `Update failed: Genre name already exists: ${params.name}`,
        )
        throw new GenreAlreadyExistsException(params.name)
      }
    }

    const updatedGenre = await this.genreRepository.update(id, {
      name: params.name,
    })

    if (!updatedGenre) {
      this.logger.error(
        `Unexpected error: Genre not found after update attempt ID: ${id}`,
      )
      throw new GenreNotFoundException(id)
    }

    this.logger.log(
      `Genre updated successfully with name: ${updatedGenre.name} and ID: ${id}`,
    )
    return updatedGenre
  }
}
