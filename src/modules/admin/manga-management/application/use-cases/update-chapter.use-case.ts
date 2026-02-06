import { Inject, Injectable } from '@nestjs/common'

import { ChapterDoesNotBelongToMangaException } from '@/core/domain/exceptions/chapter/chapter-does-not-belong-to-manga.exception'
import { ChapterNotFoundException } from '@/core/domain/exceptions/chapter/chapter-not-found.exception'
import { MangaNotFoundException } from '@/core/domain/exceptions/manga/manga-not-found'
import { ChapterRepository } from '@/core/domain/repositories/chapter.repository'
import { MangaRepository } from '@/core/domain/repositories/manga.repository'

import { UpdateChapterDto } from '../dtos/update-chapter.dto'

@Injectable()
export class UpdateChapterUseCase {
  constructor(
    @Inject('ChapterRepository')
    private readonly chapterRepository: ChapterRepository,
    @Inject('MangaRepository')
    private readonly mangaRepository: MangaRepository,
  ) {}

  async execute(mangaId: string, chapterId: string, dto: UpdateChapterDto) {
    const manga = await this.mangaRepository.findById(mangaId)

    if (!manga) {
      throw new MangaNotFoundException()
    }

    const chapter = await this.chapterRepository.findById(chapterId)

    if (!chapter) {
      throw new ChapterNotFoundException(chapterId)
    }

    if (chapter.mangaId !== mangaId) {
      throw new ChapterDoesNotBelongToMangaException(chapterId, mangaId)
    }

    chapter.title = dto.title
    chapter.updatedAt = new Date()

    const updatedChapter = await this.chapterRepository.update(chapter)

    return updatedChapter
  }
}
