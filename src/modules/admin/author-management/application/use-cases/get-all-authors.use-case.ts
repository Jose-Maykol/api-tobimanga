import { Inject, Injectable, Logger } from '@nestjs/common'

import { Author } from '@/core/domain/entities/author.entity'
import { AuthorRepository } from '@/core/domain/repositories/author.repository'
import { AUTHOR_REPOSITORY } from '@/infrastructure/tokens/repositories'

@Injectable()
export class GetAllAuthorsUseCase {
  private readonly logger = new Logger(GetAllAuthorsUseCase.name)

  constructor(
    @Inject(AUTHOR_REPOSITORY)
    private readonly authorRepository: AuthorRepository,
  ) {}

  async execute(): Promise<Author[]> {
    const authors = await this.authorRepository.findAll()
    this.logger.log(`Retrieved ${authors.length} authors`)
    return authors
  }
}
