import { Inject, Injectable } from '@nestjs/common'
import { GenreRepository } from '../../domain/repositories/genre.repository'
import { Genre } from '../../domain/entities/genre.entity'
import { GenreNotFoundException } from '../../domain/exceptions/genre-not-found.exception'

@Injectable()
export class GetGenreByIdUseCase {
  constructor(
    @Inject('GenreRepository')
    private readonly genreRepository: GenreRepository,
  ) {}

  async execute(id: string): Promise<Genre> {
    const genre = await this.genreRepository.findById(id)
    if (!genre) {
      throw new GenreNotFoundException(id)
    }

    return genre
  }
}
