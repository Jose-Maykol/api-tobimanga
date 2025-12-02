import { Inject, Injectable } from '@nestjs/common'

import { calculatePagination } from '@/common/utils/pagination.util'
import { MangaRepository } from '@/core/domain/repositories/manga.repository'
import { MANGA_REPOSITORY } from '@/infrastructure/tokens/repositories'

import { ListMangasDto } from '../dtos/list-mangas.dto'

@Injectable()
export class ListMangasUseCase {
  constructor(
    @Inject(MANGA_REPOSITORY)
    private readonly mangaRepository: MangaRepository,
  ) {}

  async execute(params: ListMangasDto) {
    const { page, limit } = params

    const [mangas, totalMangas] = await Promise.all([
      this.mangaRepository.findAll(page, limit),
      this.mangaRepository.countAll(),
    ])

    const meta = calculatePagination(totalMangas, page, limit)

    return { items: mangas, meta }
  }
}
