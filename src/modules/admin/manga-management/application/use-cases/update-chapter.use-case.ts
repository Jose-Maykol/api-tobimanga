import { Inject, Injectable, Logger } from '@nestjs/common'

import { ChapterDoesNotBelongToMangaException } from '@/modules/admin/manga-management/domain/exceptions/chapter-does-not-belong-to-manga.exception'
import { ChapterNotFoundException } from '@/modules/admin/manga-management/domain/exceptions/chapter-not-found.exception'
import { MangaNotFoundException } from '@/modules/admin/manga-management/domain/exceptions/manga-not-found.exception'

// Chapter entity import removed
import { ChapterRepository } from '../../domain/repositories/chapter.repository'
import { MangaRepository } from '../../domain/repositories/manga.repository'
import { CHAPTER_REPOSITORY, MANGA_REPOSITORY } from '../../domain/tokens'
import { UpdateChapterDto } from '../dtos/update-chapter.dto'

@Injectable()
export class UpdateChapterUseCase {
  private readonly logger = new Logger(UpdateChapterUseCase.name)

  constructor(
    @Inject(CHAPTER_REPOSITORY)
    private readonly chapterRepository: ChapterRepository,
    @Inject(MANGA_REPOSITORY)
    private readonly mangaRepository: MangaRepository,
  ) {}

  async execute(mangaId: string, chapterId: string, dto: UpdateChapterDto) {
    const manga = await this.mangaRepository.findById(mangaId)

    if (!manga) {
      this.logger.warn(
        `Chapter update failed, manga not found with ID ${mangaId}`,
      )
      throw new MangaNotFoundException(mangaId)
    }

    const chapter = await this.chapterRepository.findById(chapterId)

    if (!chapter) {
      this.logger.warn(
        `Chapter update failed, chapter not found with ID ${chapterId}`,
      )
      throw new ChapterNotFoundException(chapterId)
    }

    if (chapter.mangaId !== mangaId) {
      this.logger.warn(
        `Chapter update failed, chapter ${chapterId} does not belong to manga ${mangaId}`,
      )
      throw new ChapterDoesNotBelongToMangaException(chapterId, mangaId)
    }

    chapter.title = dto.title
    chapter.updatedAt = new Date()

    const updatedChapter = await this.chapterRepository.update(chapter)

    this.logger.log(
      `Chapter ${chapter.chapterNumber} updated successfully for manga ID ${mangaId}`,
    )

    return updatedChapter
  }
}
