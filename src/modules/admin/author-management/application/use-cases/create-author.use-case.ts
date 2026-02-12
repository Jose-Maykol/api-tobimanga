import { Inject, Injectable, Logger } from '@nestjs/common'

import { AuthorAlreadyExistsException } from '@/modules/admin/author-management/domain/exceptions/author-already-exists.exception'

import { Author } from '../../domain/entities/author.entity'
import { AuthorRepository } from '../../domain/repositories/author.repository'
import { AUTHOR_REPOSITORY } from '../../infrastructure/tokens'
import { CreateAuthorDto } from '../dtos/create-author.dto'

@Injectable()
export class CreateAuthorUseCase {
  private readonly logger = new Logger(CreateAuthorUseCase.name)

  constructor(
    @Inject(AUTHOR_REPOSITORY)
    private readonly authorRepository: AuthorRepository,
  ) {}

  async execute(params: CreateAuthorDto): Promise<Author> {
    const existingAuthor = await this.authorRepository.findByName(params.name)
    if (existingAuthor) {
      this.logger.warn(
        `Creation failed, author name already exists with name ${params.name}`,
      )
      throw new AuthorAlreadyExistsException(params.name)
    }

    const author: Author = {
      id: crypto.randomUUID(),
      name: params.name,
      createdAt: new Date(),
      updatedAt: null,
    }

    const createdAuthor = await this.authorRepository.save(author)
    this.logger.log(
      `Author created successfully with name ${createdAuthor.name} and ID ${createdAuthor.id}`,
    )

    return createdAuthor
  }
}
