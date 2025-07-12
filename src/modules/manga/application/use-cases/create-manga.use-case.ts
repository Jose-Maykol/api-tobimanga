import { Injectable } from '@nestjs/common'
import { CreateMangaDto } from '../dtos/create-manga.dto'

@Injectable()
export class CreateMangaUseCase {
  constructor /* @Inject('MangaRepository')
    private readonly mangaRepository: MangaRepository, */() {}

  async execute(params: CreateMangaDto) {
    const { authors, genres, demographic } = params

    const genresIds = genres.map((genre) => genre.id)
    const authorsIds = authors.map((author) => author.id)
  }
}
