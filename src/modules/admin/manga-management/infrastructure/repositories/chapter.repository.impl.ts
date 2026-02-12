import { and, asc, count, desc, eq } from 'drizzle-orm'

import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { chapters } from '@/core/database/schemas/chapter.schema'
import { DatabaseService } from '@/core/database/services/database.service'

import { Chapter } from '../../domain/entities/chapter.entity'
import { ChapterRepository } from '../../domain/repositories/chapter.repository'

@Injectable()
export class ChapterRepositoryImpl implements ChapterRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  async save(chapter: Chapter): Promise<Chapter> {
    await this.db.client.insert(chapters).values({
      id: chapter.id,
      mangaId: chapter.mangaId,
      chapterNumber: chapter.chapterNumber,
      title: chapter.title,
      releaseDate: chapter.releaseDate?.toISOString() ?? null,
      createdAt: chapter.createdAt,
      updatedAt: chapter.updatedAt ? chapter.updatedAt : null,
    })

    return chapter
  }

  async findById(id: string): Promise<Chapter | null> {
    const rows = await this.db.client
      .select()
      .from(chapters)
      .where(eq(chapters.id, id))

    const row = rows[0]

    if (!row) return null

    const result: Chapter = {
      ...row,
      releaseDate: row.releaseDate ? new Date(row.releaseDate) : null,
      createdAt: row.createdAt ? new Date(row.createdAt) : row.createdAt,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : null,
    }

    return result
  }

  async findByMangaId(
    mangaId: string,
    page: number,
    limit: number,
    order: 'asc' | 'desc',
  ): Promise<Chapter[]> {
    const offset = (page - 1) * limit

    const orderFn = order === 'asc' ? asc : desc
    const rows = await this.db.client
      .select()
      .from(chapters)
      .where(eq(chapters.mangaId, mangaId))
      .orderBy(orderFn(chapters.chapterNumber))
      .limit(limit)
      .offset(offset)

    const chaptersList = rows.map((row) => ({
      ...row,
      releaseDate: row.releaseDate ? new Date(row.releaseDate) : null,
      createdAt: row.createdAt ? new Date(row.createdAt) : row.createdAt,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : null,
    }))

    return chaptersList
  }

  async findByMangaIdAndChapterNumber(
    mangaId: string,
    chapterNumber: number,
  ): Promise<Chapter | null> {
    const rows = await this.db.client
      .select()
      .from(chapters)
      .where(
        and(
          eq(chapters.mangaId, mangaId),
          eq(chapters.chapterNumber, chapterNumber),
        ),
      )

    const row = rows[0]

    if (!row) return null

    const result: Chapter = {
      ...row,
      releaseDate: row.releaseDate ? new Date(row.releaseDate) : null,
      createdAt: row.createdAt ? new Date(row.createdAt) : row.createdAt,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : null,
    }

    return result
  }

  async getLastChapterNumber(mangaId: string): Promise<number | null> {
    const rows = await this.db.client
      .select()
      .from(chapters)
      .where(eq(chapters.mangaId, mangaId))
      .orderBy(desc(chapters.chapterNumber))
      .limit(1)

    const row = rows[0]

    return row ? row.chapterNumber : null
  }

  async update(chapter: Chapter): Promise<Chapter> {
    await this.db.client
      .update(chapters)
      .set({
        title: chapter.title,
        releaseDate: chapter.releaseDate?.toISOString() ?? null,
        updatedAt: new Date(),
      })
      .where(eq(chapters.id, chapter.id))

    return {
      ...chapter,
      updatedAt: new Date(),
    }
  }

  async countAllByMangaId(mangaId: string): Promise<number> {
    const result = await this.db.client
      .select({ count: count() })
      .from(chapters)
      .where(eq(chapters.mangaId, mangaId))

    return result[0]?.count ?? 0
  }

  async saveMany(mangaId: string, chapterCount: number): Promise<void> {
    const now: Date = new Date()
    const chaptersToInsert: Array<{
      mangaId: string
      chapterNumber: number
      releaseDate: string | null
      createdAt: Date
      updatedAt: Date | null
    }> = Array.from({ length: chapterCount }, (_, i) => ({
      mangaId,
      chapterNumber: i + 1,
      releaseDate: null,
      createdAt: now,
      updatedAt: null,
    }))

    await this.db.client.insert(chapters).values(chaptersToInsert)
  }
}
