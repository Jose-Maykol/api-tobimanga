import { eq } from 'drizzle-orm'

import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { chapters } from '@/core/database/schemas/chapter.schema'
import { DatabaseService } from '@/core/database/services/database.service'

import { ChapterListItemDto } from '../../application/dtos/chapter-list-item.dto'

@Injectable()
export class ChapterReadRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  /**
   * Retrieve all chapters for a specific manga.
   * @param mangaId The manga UUID
   * @returns Promise with array of chapter items
   */
  async findByMangaId(mangaId: string): Promise<ChapterListItemDto[]> {
    const items = await this.db.client
      .select({
        id: chapters.id,
        chapterNumber: chapters.chapterNumber,
        releaseDate: chapters.releaseDate,
        createdAt: chapters.createdAt,
        updatedAt: chapters.updatedAt,
      })
      .from(chapters)
      .where(eq(chapters.mangaId, mangaId))
      .orderBy(chapters.chapterNumber)

    return items as ChapterListItemDto[]
  }
}
