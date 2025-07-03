import { Inject, Injectable } from '@nestjs/common'
import { AuthorRepository } from '../../domain/repositories/author.repository'
import { Author } from '../../domain/entities/author.entity'
import { AuthorNotFoundException } from '../../domain/exceptions/author-not-found.exception'

@Injectable()
export class GetAuthorsByIdsUseCase {
  constructor(
    @Inject('AuthorRepository')
    private readonly authorRepository: AuthorRepository,
  ) {}

  async execute(ids: string[]): Promise<Author[]> {
    const authors = await this.authorRepository.findByIds(ids)
    const firstMissingAuthor = authors.find(
      (author) => !ids.includes(author.id),
    )

    if (firstMissingAuthor) {
      throw new AuthorNotFoundException(firstMissingAuthor.name)
    }

    return authors
  }
}
