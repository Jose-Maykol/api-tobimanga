import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'

import { calculatePagination } from '@/common/utils/pagination.util'

import { MangaCatalogRepository } from '../../infrastructure/repositories/manga-catalog.repository'
import { ListChaptersDto } from '../dtos/chapter-list.dto'

@Injectable()
export class ListChaptersByMangaSlugUseCase {
  private readonly logger = new Logger(ListChaptersByMangaSlugUseCase.name)

  constructor(
    @Inject()
    private readonly mangaCatalogRepository: MangaCatalogRepository,
  ) {}

  async execute(slug: string, params: ListChaptersDto) {
    const { page = 1, limit = 20, order = 'DESC' } = params

    const mangaId = await this.mangaCatalogRepository.findMangaIdBySlug(slug)

    if (!mangaId) {
      this.logger.warn(`Manga with slug ${slug} not found`)
      throw new NotFoundException(`Manga with slug ${slug} not found`)
    }

    const [chapters, totalChapters] = await Promise.all([
      this.mangaCatalogRepository.findChaptersByMangaId(
        mangaId,
        page,
        limit,
        order,
      ),
      this.mangaCatalogRepository.countChaptersByMangaId(mangaId),
    ])

    const meta = calculatePagination(totalChapters, page, limit)

    return { items: chapters, meta }
  }
}
