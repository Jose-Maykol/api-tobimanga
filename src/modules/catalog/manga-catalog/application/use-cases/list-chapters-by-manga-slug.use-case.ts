import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'

import { calculatePagination } from '@/common/utils/pagination.util'

import { FindChaptersDto } from '../../domain/dtos/find-chapters.dto'
import { IMangaCatalogRepository } from '../../domain/repositories/manga-catalog.repository'
import { MANGA_CATALOG_REPOSITORY } from '../../infrastructure/tokens'
import { ListChaptersDto } from '../dtos/chapter-list.dto'

@Injectable()
export class ListChaptersByMangaSlugUseCase {
  private readonly logger = new Logger(ListChaptersByMangaSlugUseCase.name)

  constructor(
    @Inject(MANGA_CATALOG_REPOSITORY)
    private readonly mangaCatalogRepository: IMangaCatalogRepository,
  ) {}

  async execute(slug: string, params: ListChaptersDto) {
    const { page = 1, limit = 20, order = 'DESC' } = params

    const mangaId = await this.mangaCatalogRepository.findMangaIdBySlug(slug)

    if (!mangaId) {
      this.logger.warn(`Manga with slug ${slug} not found`)
      throw new NotFoundException(`Manga with slug ${slug} not found`)
    }

    const findParams: FindChaptersDto = {
      page,
      limit,
      order,
    }

    const [chapters, totalChapters] = await Promise.all([
      this.mangaCatalogRepository.findChaptersByMangaId(mangaId, findParams),
      this.mangaCatalogRepository.countChaptersByMangaId(mangaId),
    ])

    const meta = calculatePagination(totalChapters, page, limit)

    return { items: chapters, meta }
  }
}
