import { Inject, Injectable, Logger } from '@nestjs/common'

import { ChapterAlreadyExistsException } from '@/modules/admin/manga-management/domain/exceptions/chapter-already-exists.exception'
import { MangaNotFoundException } from '@/modules/admin/manga-management/domain/exceptions/manga-not-found.exception'

import { ChapterFactory } from '../../domain/factories/chapter.factory'
// Chapter entity import removed
import { ChapterRepository } from '../../domain/repositories/chapter.repository'
import { MangaRepository } from '../../domain/repositories/manga.repository'
import {
  CHAPTER_REPOSITORY,
  MANGA_REPOSITORY,
} from '../../domain/tokens'
import { CreateChapterDto } from '../dtos/create-chapter.dto'

@Injectable()
export class CreateChapterUseCase {
  private readonly logger = new Logger(CreateChapterUseCase.name)

  constructor(
    @Inject(MANGA_REPOSITORY)
    private readonly mangaRepository: MangaRepository,
    @Inject(CHAPTER_REPOSITORY)
    private readonly chapterRepository: ChapterRepository,
    private readonly chapterFactory: ChapterFactory,
  ) { }

  async execute(mangaId: string, dto: CreateChapterDto) {
    const manga = await this.mangaRepository.findById(mangaId)

    if (!manga) {
      this.logger.warn(
        `Chapter creation failed, manga not found with ID ${mangaId}`,
      )
      throw new MangaNotFoundException(mangaId)
    }

    const lastChapterNumber =
      await this.chapterRepository.getLastChapterNumber(mangaId)
    const nextChapterNumber = lastChapterNumber ? lastChapterNumber + 1 : 1

    const existingChapter =
      await this.chapterRepository.findByMangaIdAndChapterNumber(
        mangaId,
        nextChapterNumber,
      )

    if (existingChapter) {
      this.logger.warn(
        `Chapter creation failed, chapter ${nextChapterNumber} already exists for manga ID ${mangaId}`,
      )
      throw new ChapterAlreadyExistsException(nextChapterNumber, manga.id)
    }

    const newChapter = this.chapterFactory.create({
      mangaId,
      chapterNumber: nextChapterNumber,
      title: dto.title,
      releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : null,
    })

    const savedChapter = await this.chapterRepository.save(newChapter)

    await this.mangaRepository.incrementChapterCount(mangaId)

    this.logger.log(
      `Chapter ${nextChapterNumber} created successfully for manga ID: ${mangaId}`,
    )

    return savedChapter
  }
}
