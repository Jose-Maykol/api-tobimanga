import { Inject, Injectable, Logger } from '@nestjs/common'

import { Pagination } from '@/common/interfaces/pagination.interface'
import { calculatePagination } from '@/common/utils/pagination.util'

import { Chapter } from '../../domain/entities/chapter.entity'
import { ChapterRepository } from '../../domain/repositories/chapter.repository'
// MangaRepository import removed
import { CHAPTER_REPOSITORY } from '../../domain/tokens'
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

    this.logger.log(
      `Retrieved ${chapters.length} chapters for manga ID ${params.mangaId} (page ${params.page}, total ${totalChapters})`,
    )

    return {
      chapters,
      meta: pagination,
    }
  }
}
