import { Inject, Injectable } from '@nestjs/common'
import { Genre } from '../../../../core/domain/entities/genre.entity'
import { CreateGenreDto } from '../dtos/create-genre.dto'
import { GenreAlreadyExistsException } from '@/core/domain/exceptions/genre/genre-already-exists.exception'
import { GenreRepository } from '@/core/domain/repositories/genre.repository'

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
