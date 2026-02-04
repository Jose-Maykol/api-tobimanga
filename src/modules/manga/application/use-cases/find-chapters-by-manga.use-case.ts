import { Inject, Injectable } from '@nestjs/common'

import { ChapterReadRepository } from '../../infrastructure/repositories/chapter.read.repository'
import { ChapterListItemDto } from '../dtos/chapter-list-item.dto'

/**
 * Use case for retrieving all chapters of a specific manga.
 */
@Injectable()
export class FindChaptersByMangaUseCase {
  constructor(
    @Inject()
    private readonly chapterRepository: ChapterReadRepository,
  ) {}

  /**
   * Retrieve all chapters for a given manga.
   * @param mangaId The manga UUID
   * @returns Promise with array of chapter items
   */
  async execute(mangaId: string): Promise<ChapterListItemDto[]> {
    return await this.chapterRepository.findByMangaId(mangaId)
  }
}
