import { Inject, Injectable, Logger } from '@nestjs/common'

import { Chapter } from '@/core/domain/entities/chapter.entity'
import { ChapterRepository } from '@/core/domain/repositories/chapter.repository'
import { CHAPTER_REPOSITORY } from '@/infrastructure/tokens/repositories'

@Injectable()
export class ListChaptersByMangaUseCase {
  private readonly logger = new Logger(ListChaptersByMangaUseCase.name)

  constructor(
    @Inject(CHAPTER_REPOSITORY)
    private readonly chapterRepository: ChapterRepository,
  ) {}

  async execute(mangaId: string): Promise<Chapter[]> {
    const chapters = await this.chapterRepository.findByMangaId(mangaId)

    if (chapters.length === 0) {
      this.logger.warn(`No se encontraron capítulos para manga: ${mangaId}`)
    } else {
      this.logger.log(
        `Se encontraron ${chapters.length} capítulos para manga: ${mangaId}`,
      )
    }

    return chapters
  }
}
