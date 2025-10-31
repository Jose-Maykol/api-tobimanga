import { Inject, Injectable } from '@nestjs/common'

import { Author } from '@/core/domain/entities/author.entity'
import { AuthorNotFoundException } from '@/core/domain/exceptions/author/author-not-found.exception'
import { AuthorRepository } from '@/core/domain/repositories/author.repository'
import { AUTHOR_REPOSITORY } from '@/infrastructure/tokens/repositories'

/**
 * Use case for retrieving an author by ID.
 */
@Injectable()
export class GetAuthorByIdUseCase {
  constructor(
    @Inject(AUTHOR_REPOSITORY)
    private readonly authorRepository: AuthorRepository,
  ) {}

  /**
   * Retrieve an author by its ID.
   * @param id Author identifier
   * @returns Author entity
   * @throws AuthorNotFoundException if author is not found
   */
  async execute(id: string): Promise<Author> {
    const author = await this.authorRepository.findById(id)
    if (!author) {
      throw new AuthorNotFoundException(id)
    }
    return author
  }
}
