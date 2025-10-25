import { Inject, Injectable } from '@nestjs/common'
import { Genre } from '../../../../core/domain/entities/genre.entity'
import { GenreRepository } from '@/core/domain/repositories/genre.repository'

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
