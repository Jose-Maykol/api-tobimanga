import { Inject, Injectable, Logger } from '@nestjs/common'

import { Pagination } from '@/common/interfaces/pagination.interface'
import { calculatePagination } from '@/common/utils/pagination.util'
import { Chapter } from '@/core/domain/entities/chapter.entity'
import { ChapterRepository } from '@/core/domain/repositories/chapter.repository'
import { CHAPTER_REPOSITORY } from '@/infrastructure/tokens/repositories'

import { ListChaptersDto } from '../dtos/list-chapters.dto'

@Injectable()
export class ListChaptersByMangaUseCase {
  private readonly logger = new Logger(ListChaptersByMangaUseCase.name)

  constructor(
    @Inject(CHAPTER_REPOSITORY)
    private readonly chapterRepository: ChapterRepository,
  ) {}

  async execute(params: ListChaptersDto): Promise<{
    chapters: Chapter[]
    meta: Pagination
  }> {
    const [chapters, totalChapters] = await Promise.all([
      this.chapterRepository.findByMangaId(
        params.mangaId,
        params.page,
        params.limit,
        params.order,
      ),
      this.chapterRepository.countAllByMangaId(params.mangaId),
    ])

    const pagination = calculatePagination(
      totalChapters,
      params.page,
      params.limit,
    )

    return {
      chapters,
      meta: pagination,
    }
  }
}
