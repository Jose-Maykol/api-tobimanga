import { Inject, Injectable } from '@nestjs/common'

import { GenreRepository } from '@/core/domain/repositories/genre.repository'

import { Genre } from '../../../../core/domain/entities/genre.entity'

@Injectable()
export class GetAllGenresUseCase {
  constructor(
    @Inject('GenreRepository')
    private readonly genreRepository: GenreRepository,
  ) {}

  async execute(): Promise<Genre[]> {
    return this.genreRepository.findAll()
  }
}
