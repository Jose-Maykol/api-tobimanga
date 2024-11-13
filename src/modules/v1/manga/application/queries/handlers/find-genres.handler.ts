import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindGenresQuery } from '../find-genres.query'
import { Inject, NotFoundException } from '@nestjs/common'
import { GenreRepository } from '../../../domain/repositories/genre.repository'

@QueryHandler(FindGenresQuery)
export class FindGenresHandler implements IQueryHandler<FindGenresQuery> {
  constructor(
    @Inject('GenreRepository')
    private readonly genreRepository: GenreRepository,
  ) {}

  async execute() {
    const genres = await this.genreRepository.find()

    if (genres.length === 0) {
      throw new NotFoundException('No se encontraron géneros')
    }

    return {
      genres,
    }
  }
}
