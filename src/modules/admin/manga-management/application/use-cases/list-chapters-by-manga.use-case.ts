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
    const { mangaId, page = 1, limit = 20, order = 'desc' } = params

    const [chapters, totalChapters] = await Promise.all([
      this.chapterRepository.findByMangaId(mangaId, page, limit, order),
      this.chapterRepository.countAllByMangaId(mangaId),
    ])

    const pagination = calculatePagination(totalChapters, page, limit)

    this.logger.log(
      `Retrieved ${chapters.length} chapters for manga ID ${mangaId} (page ${page}, total ${totalChapters})`,
    )

    return {
      chapters,
      meta: pagination,
    }
  }
}
