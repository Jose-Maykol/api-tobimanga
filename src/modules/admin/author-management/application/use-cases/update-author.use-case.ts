import { Inject, Injectable, Logger } from '@nestjs/common'

import { Author } from '@/core/domain/entities/author.entity'
import { AuthorAlreadyExistsException } from '@/core/domain/exceptions/author/author-already-exists.exception'
import { AuthorNotFoundException } from '@/core/domain/exceptions/author/author-not-found.exception'
import { AuthorRepository } from '@/core/domain/repositories/author.repository'
import { AUTHOR_REPOSITORY } from '@/infrastructure/tokens/repositories'

import { UpdateAuthorDto } from '../dtos/update-author.dto'

@Injectable()
export class UpdateAuthorUseCase {
  private readonly logger = new Logger(UpdateAuthorUseCase.name)

  constructor(
    @Inject(AUTHOR_REPOSITORY)
    private readonly authorRepository: AuthorRepository,
  ) {}

  async execute(id: string, params: UpdateAuthorDto): Promise<Author> {
    const currentAuthor = await this.authorRepository.findById(id)

    if (!currentAuthor) {
      this.logger.warn(`Update failed: Author not found with ID: ${id}`)
      throw new AuthorNotFoundException(id)
    }

    if (params.name !== currentAuthor.name) {
      const nameExists = await this.authorRepository.findByName(params.name)
      if (nameExists) {
        this.logger.warn(
          `Update failed: Author name already exists: ${params.name}`,
        )
        throw new AuthorAlreadyExistsException(params.name)
      }
    }

    const updatedAuthor = await this.authorRepository.update(id, {
      name: params.name,
    })

    if (!updatedAuthor) {
      this.logger.error(
        `Unexpected error: Author not found after update attempt [ID: ${id}]`,
      )
      throw new AuthorNotFoundException(id)
    }

    this.logger.log(
      `Author updated successfully. Name: ${updatedAuthor.name}, ID: ${id}`,
    )
    return updatedAuthor
  }
}
