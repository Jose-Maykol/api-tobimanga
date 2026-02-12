import { Inject, Injectable, Logger } from '@nestjs/common'

import { GenreAlreadyExistsException } from '@/modules/admin/genre-management/domain/exceptions/genre-already-exists.exception'
import { GenreNotFoundException } from '@/modules/admin/genre-management/domain/exceptions/genre-not-found.exception'

import { Genre } from '../../domain/entities/genre.entity'
import { GenreRepository } from '../../domain/repositories/genre.repository'
import { GENRE_REPOSITORY } from '../../infrastructure/tokens'
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
      this.logger.warn(`Update failed, genre not found with ID ${id}`)
      throw new GenreNotFoundException(id)
    }

    if (params.name !== currentGenre.name) {
      const nameExists = await this.genreRepository.findByName(params.name)
      if (nameExists) {
        this.logger.warn(
          `Update failed, genre with name ${params.name} already exists`,
        )
        throw new GenreAlreadyExistsException(params.name)
      }
    }

    const updatedGenre = await this.genreRepository.update(id, {
      name: params.name,
    })

    if (!updatedGenre) {
      this.logger.error(
        `Unexpected error, genre not found after update attempt ID ${id}`,
      )
      throw new GenreNotFoundException(id)
    }

    this.logger.log(`Genre with ID ${id} updated successfully`)
    return updatedGenre
  }
}
