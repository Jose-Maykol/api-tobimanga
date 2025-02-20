import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { Injectable } from '@nestjs/common'
import { UserMangaRepository } from '../../domain/repositories/user-manga.repository'
import { userMangas } from '@/modules/database/schemas/user-manga.schema'
import { MangaReadingStatus } from '../../domain/enums/manga-reading-status.enum'
import { eq } from 'drizzle-orm'
import { userChapters } from '@/modules/database/schemas/user-chapter.schema'
import { chapters } from '@/modules/database/schemas/chapter.schema'
import { UserMangaMapper } from '../mappers/user-manga.mapper'
import { UserManga } from '../../domain/entities/user-manga.entity'

@Injectable()
export class UserMangaRepositoryImpl implements UserMangaRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async save(userManga: UserManga): Promise<void> {
    const db = this.drizzle.db
    const userMangaPersistence = UserMangaMapper.toPersistence(userManga)
    await db.transaction(async (tx) => {
      await this.drizzle.db.insert(userMangas).values(userMangaPersistence)
      const { userId, mangaId, readingStatus } = userMangaPersistence
      if (readingStatus === MangaReadingStatus.READING) {
        await this.createChapters(userId, mangaId, tx)
      }
    })
  }

  async createChapters(
    userId: string,
    mangaId: string,
    tx?: any,
  ): Promise<void> {
    const db = tx || this.drizzle.db

    const mangaChapters = await db
      .select({
        id: chapters.id,
      })
      .from(chapters)
      .where(eq(chapters.mangaId, mangaId))
      .execute()

    const userChapterRecords = mangaChapters.map((chapter) => ({
      userId,
      chapterId: chapter.id,
      read: false,
      createdAt: new Date(),
    }))

    await db.insert(userChapters).values(userChapterRecords).execute()
  }
}
