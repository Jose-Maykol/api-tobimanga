import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindGenresQuery } from '../find-genres.query'
import { GenreReadRepository } from '../../../infrastructure/repositories/read/genre-read.repository'

@QueryHandler(FindGenresQuery)
export class FindGenresHandler implements IQueryHandler<FindGenresQuery> {
  constructor(private readonly genreRepository: GenreReadRepository) {}

  async execute() {
    const genres = await this.genreRepository.findAll()

    return {
      genres,
    }
  }
}
