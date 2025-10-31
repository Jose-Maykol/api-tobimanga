import { Inject, Injectable } from '@nestjs/common'

import { Author } from '@/core/domain/entities/author.entity'
import { AuthorRepository } from '@/core/domain/repositories/author.repository'
import { AUTHOR_REPOSITORY } from '@/infrastructure/tokens/repositories'

@Injectable()
export class GetAllAuthorsUseCase {
  constructor(
    @Inject(AUTHOR_REPOSITORY)
    private readonly authorRepository: AuthorRepository,
  ) {}

  async execute(): Promise<Author[]> {
    return this.authorRepository.findAll()
  }
}
