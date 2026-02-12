import { Inject, Injectable, Logger } from '@nestjs/common'

import { Author } from '../../domain/entities/author.entity'
import { AuthorNotFoundException } from '@/core/domain/exceptions/author/author-not-found.exception'
import { AuthorRepository } from '../../domain/repositories/author.repository'
import { AUTHOR_REPOSITORY } from '../../infrastructure/tokens'

@Injectable()
export class GetAuthorByIdUseCase {
  private readonly logger = new Logger(GetAuthorByIdUseCase.name)

  constructor(
    @Inject(AUTHOR_REPOSITORY)
    private readonly authorRepository: AuthorRepository,
  ) { }

  async execute(id: string): Promise<Author> {
    const author = await this.authorRepository.findById(id)
    if (!author) {
      this.logger.warn(`Author not found with ID ${id}`)
      throw new AuthorNotFoundException(id)
    }
    return author
  }
}
