import { Inject, Injectable } from '@nestjs/common'

import { Author } from '@/core/domain/entities/author.entity'
import { AuthorAlreadyExistsException } from '@/core/domain/exceptions/author/author-already-exists.exception'
import { AuthorRepository } from '@/core/domain/repositories/author.repository'
import { AUTHOR_REPOSITORY } from '@/infrastructure/tokens/repositories'

import { CreateAuthorDto } from '../dtos/create-author.dto'

@Injectable()
export class CreateAuthorUseCase {
  constructor(
    @Inject(AUTHOR_REPOSITORY)
    private readonly authorRepository: AuthorRepository,
  ) {}

  async execute(params: CreateAuthorDto): Promise<Author> {
    const existingAuthor = await this.authorRepository.findByName(params.name)
    if (existingAuthor) {
      throw new AuthorAlreadyExistsException(params.name)
    }

    const author: Author = {
      id: crypto.randomUUID(),
      name: params.name,
      createdAt: new Date(),
      updatedAt: null,
    }

    return this.authorRepository.save(author)
  }
}
