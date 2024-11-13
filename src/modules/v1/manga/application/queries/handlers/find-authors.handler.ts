import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindAuthorsQuery } from '../find-authors.query'
import { AuthorRepository } from '../../../domain/repositories/author.repository'
import { Inject, NotFoundException } from '@nestjs/common'

@QueryHandler(FindAuthorsQuery)
export class FindAuthorsHandler implements IQueryHandler<FindAuthorsQuery> {
  constructor(
    @Inject('AuthorRepository')
    private readonly authorRepository: AuthorRepository,
  ) {}

  async execute() {
    const authors = await this.authorRepository.find()

    if (authors.length === 0) {
      throw new NotFoundException('No se encontraron autores')
    }

    return {
      authors,
    }
  }
}
