import { Inject, Injectable } from '@nestjs/common'
import { AuthorRepository } from '../../domain/repositories/author.repository'
import { CreateAuthorDto } from '../dtos/create-author.dto'
import { Author } from '../../domain/entities/author.entity'
import { AuthorAlreadyExistsException } from '../../domain/exceptions/author-already-exists.exception'

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
