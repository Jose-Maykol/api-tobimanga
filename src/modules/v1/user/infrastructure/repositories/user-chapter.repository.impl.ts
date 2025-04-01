import { Injectable } from '@nestjs/common'
import { UserChapterRepository } from '../../domain/repositories/user-chapter.repository'
import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { UserChapter } from '../../domain/entities/user-chapter.entitiy'
import { UserChapterMapper } from '../mappers/user-chapter.mapper'
import { userChapters } from '@/modules/database/schemas/user-chapter.schema'
import { and, eq } from 'drizzle-orm'

@Injectable()
export class UserChapterRepositoryImpl implements UserChapterRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async save(chapter: UserChapter): Promise<void> {
    const persistenceChapter = UserChapterMapper.toPersistence(chapter)
    await this.drizzle.db
      .insert(userChapters)
      .values(persistenceChapter)
      .execute()
  }

  async update(chapter: UserChapter): Promise<void> {
    const persistenceChapter = UserChapterMapper.toPersistence(chapter)
    await this.drizzle.db
      .update(userChapters)
      .set(persistenceChapter)
      .where(
        and(
          eq(userChapters.userId, chapter.userId),
          eq(userChapters.chapterId, chapter.chapterId),
        ),
      )
      .execute()
  }

  async delete(userId: string, chapterId: string): Promise<void> {
    await this.drizzle.db
      .delete(userChapters)
      .where(
        and(eq(userChapters.userId, userId), eq(userChapters.chapterId, chapterId)),
      )
      .execute()
  }
}
