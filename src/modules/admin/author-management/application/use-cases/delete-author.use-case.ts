import { Inject, Injectable, Logger } from '@nestjs/common'

import { AuthorNotFoundException } from '@/modules/admin/author-management/domain/exceptions/author-not-found.exception'

import { AuthorRepository } from '../../domain/repositories/author.repository'
import { AUTHOR_REPOSITORY } from '../../infrastructure/tokens'

@Injectable()
export class DeleteAuthorUseCase {
  private readonly logger = new Logger(DeleteAuthorUseCase.name)

  constructor(
    @Inject(AUTHOR_REPOSITORY)
    private readonly authorRepository: AuthorRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const author = await this.authorRepository.findById(id)

    if (!author) {
      this.logger.warn(`Author not found with ID ${id}`)
      throw new AuthorNotFoundException(id)
    }

    const deleted = await this.authorRepository.delete(id)

    if (!deleted) {
      this.logger.error(`Failed to delete author with ID ${id}`)
      throw new AuthorNotFoundException(id)
    }

    this.logger.log(
      `Author with name ${author.name} and ID ${id} deleted successfully`,
    )
  }
}
