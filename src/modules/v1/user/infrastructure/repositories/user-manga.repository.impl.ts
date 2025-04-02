import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { Injectable } from '@nestjs/common'
import { userMangas } from '@/modules/database/schemas/user-manga.schema'
import { and, count, desc, eq, sql } from 'drizzle-orm'
import { userChapters } from '@/modules/database/schemas/user-chapter.schema'
import { chapters } from '@/modules/database/schemas/chapter.schema'
import { UserManga } from '../../domain/entities/user-manga.entity'
import { UserMangaMapper } from '../mappers/user-manga.mapper'
import { UserMangaRepository } from '../../domain/repositories/user-manga.repository'
import ChapterRecord from '@/modules/v1/manga/domain/types/chapter'

@Injectable()
export class UserMangaRepositoryImpl implements UserMangaRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async save(userManga: UserManga): Promise<void> {
    const userMangaPersistence = UserMangaMapper.toPersistence(userManga)
    await this.drizzle.db
      .insert(userMangas)
      .values(userMangaPersistence)
      .execute()
  }

  async find(mangaId: string, userId: string): Promise<UserManga | null> {
    const userManga = await this.drizzle.db
      .select()
      .from(userMangas)
      .where(
        and(eq(userMangas.mangaId, mangaId), eq(userMangas.userId, userId)),
      )
      .limit(1)

    if (userManga.length === 0) return null

    return userManga.map((manga) => UserMangaMapper.toDomain(manga))[0]
  }

  async findPaginatedChaptersReadByMangaId(
    mangaId: string,
    page: number,
    limit: number,
    userId: string,
  ): Promise<
    [
      Partial<ChapterRecord & { readAt: Date | null; read: boolean }>[],
      { count: number },
    ]
  > {
    const offset = (page - 1) * limit

    const paginatedChapters = await this.drizzle.db
      .select({
        id: chapters.id,
        chapterNumber: chapters.chapterNumber,
        readAt: userChapters.readAt,
        read: sql<boolean>`COALESCE(${userChapters.read}, false)`,
      })
      .from(chapters)
      .leftJoin(
        userChapters,
        and(
          eq(userChapters.chapterId, chapters.id),
          eq(userChapters.userId, userId),
        ),
      )
      .where(eq(chapters.mangaId, mangaId))
      .offset(offset)
      .limit(limit)
      .orderBy(desc(chapters.chapterNumber))
    /* .select({
        id: chapters.id,
        chapterNumber: chapters.chapterNumber,
        readAt: userChapters.readAt,
        read: userChapters.read,
      })
      .from(userChapters)
      .innerJoin(chapters, eq(userChapters.chapterId, chapters.id))
      .innerJoin(userMangas, eq(userMangas.mangaId, mangaId))
      .where(
        and(eq(userMangas.mangaId, mangaId), eq(userChapters.userId, userId)),
      )
      .offset(offset)
      .limit(limit)
      .orderBy(desc(chapters.chapterNumber)) */

    const totalChapters = await this.drizzle.db
      .select({ count: count() })
      .from(chapters)
      .leftJoin(
        userChapters,
        and(
          eq(userChapters.chapterId, chapters.id),
          eq(userChapters.userId, userId),
        ),
      )
      .where(eq(chapters.mangaId, mangaId))
    /* .from(userChapters)
      .innerJoin(chapters, eq(userChapters.chapterId, chapters.id))
      .innerJoin(userMangas, eq(userMangas.mangaId, mangaId))
      .where(
        and(eq(userMangas.mangaId, mangaId), eq(userChapters.userId, userId)),
      ) */

    return [
      paginatedChapters,
      {
        count: totalChapters[0].count,
      },
    ]
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
