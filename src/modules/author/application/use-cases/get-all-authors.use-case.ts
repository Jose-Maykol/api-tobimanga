import { Inject, Injectable } from '@nestjs/common'

import { AuthorRepository } from '@/core/domain/repositories/author.repository'

import { Author } from '../../../../core/domain/entities/author.entity'

@Injectable()
export class GetAllAuthorsUseCase {
  constructor(
    @Inject('AuthorRepository')
    private readonly authorRepository: AuthorRepository,
  ) {}

  async execute(): Promise<Author[]> {
    return this.authorRepository.findAll()
  }
}
