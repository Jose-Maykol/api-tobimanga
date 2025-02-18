import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindAuthorsQuery } from '../find-authors.query'
import { AuthorRepository } from '../../../domain/repositories/author.repository'
import { Inject } from '@nestjs/common'
import { AuthorNotFoundException } from '../../exceptions/author-not-found.exception'

@QueryHandler(FindAuthorsQuery)
export class FindAuthorsHandler implements IQueryHandler<FindAuthorsQuery> {
  constructor(
    @Inject('AuthorRepository')
    private readonly authorRepository: AuthorRepository,
  ) {}

  async execute() {
    const authors = await this.authorRepository.findAll()

    if (!authors) {
      throw new AuthorNotFoundException()
    }

    return {
      authors,
    }
  }
}
