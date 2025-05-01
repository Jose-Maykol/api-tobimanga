import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindAuthorsQuery } from '../find-authors.query'
import { AuthorReadRepository } from '../../../infrastructure/repositories/read/author-read.repository'

@QueryHandler(FindAuthorsQuery)
export class FindAuthorsHandler implements IQueryHandler<FindAuthorsQuery> {
  constructor(private readonly authorRepository: AuthorReadRepository) {}

  async execute() {
    const authors = await this.authorRepository.findAll()

    return {
      authors,
    }
  }
}
