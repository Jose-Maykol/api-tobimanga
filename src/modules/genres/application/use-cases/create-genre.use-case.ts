import { Inject, Injectable } from '@nestjs/common'
import { GenreRepository } from '../../domain/repositories/genre.repository'
import { Genre } from '../../domain/entities/genre.entity'
import { GenreAlreadyExistsException } from '../../domain/exceptions/genre-already-exists.exception'
import { CreateGenreDto } from '../dtos/create-genre.dto'

@Injectable()
export class CreateGenreUseCase {
  constructor(
    @Inject('GenreRepository')
    private readonly genreRepository: GenreRepository,
  ) {}

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
