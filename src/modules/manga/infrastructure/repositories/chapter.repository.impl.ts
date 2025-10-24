import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { DatabaseService } from '@/core/database/services/database.service'
import { Inject, Injectable } from '@nestjs/common'
import { Chapter } from '../../domain/entities/chapter.entity'
import { chapters } from '@/core/database/schemas/chapter.schema'
import { eq } from 'drizzle-orm'
import { ChapterRepository } from '../../domain/repositories/chapter.repository'

@Injectable()
export class ChapterRepositoryImpl implements ChapterRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  async save(chapter: Chapter): Promise<Chapter> {
    await this.db.client.insert(chapters).values({
      mangaId: chapter.mangaId,
      chapterNumber: chapter.chapterNumber,
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
}
