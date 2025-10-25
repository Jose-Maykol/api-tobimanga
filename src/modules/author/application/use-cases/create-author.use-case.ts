import { Inject, Injectable } from '@nestjs/common'

import { AuthorAlreadyExistsException } from '@/core/domain/exceptions/author/author-already-exists.exception'
import { AuthorRepository } from '@/core/domain/repositories/author.repository'

import { Author } from '../../../../core/domain/entities/author.entity'
import { CreateAuthorDto } from '../dtos/create-author.dto'

@Injectable()
export class CreateAuthorUseCase {
  constructor(
    @Inject('AuthorRepository')
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
