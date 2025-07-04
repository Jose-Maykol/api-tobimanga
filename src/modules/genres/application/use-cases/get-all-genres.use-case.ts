import { Inject, Injectable } from '@nestjs/common'
import { GenreRepository } from '../../domain/repositories/genre.repository'
import { Genre } from '../../domain/entities/genre.entity'

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
