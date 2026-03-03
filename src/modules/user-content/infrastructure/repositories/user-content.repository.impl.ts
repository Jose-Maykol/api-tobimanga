import { and, eq } from 'drizzle-orm'

import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { userChapterProgress } from '@/core/database/schemas/user-chapter-progress.schema'
import { userMangas } from '@/core/database/schemas/user-manga.schema'
import { DatabaseService } from '@/core/database/services/database.service'

import { UserChapterProgress } from '../../domain/entities/user-chapter-progress.entity'
import { UserManga } from '../../domain/entities/user-manga.entity'
import { IUserContentRepository } from '../../domain/repositories/user-content.repository'
import { ReadingStatus } from '../../domain/value-objects/reading-status.vo'

@Injectable()
export class UserContentRepositoryImpl implements IUserContentRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  async findByUserAndManga(
    userId: string,
    mangaId: string,
  ): Promise<UserManga | null> {
    const result = await this.db.client.query.userMangas.findFirst({
      where: (userMangas, { eq, and }) =>
        and(eq(userMangas.userId, userId), eq(userMangas.mangaId, mangaId)),
    })

    if (!result) {
      return null
    }

    return {
      id: result.id,
      userId: result.userId,
      mangaId: result.mangaId,
      rating: result.rating,
      readingStatus: result.readingStatus as ReadingStatus,
      isFavorite: result.isFavorite,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    }
  }

  async save(userManga: Omit<UserManga, 'id'>): Promise<UserManga> {
    const [result] = await this.db.client
      .insert(userMangas)
      .values({
        userId: userManga.userId,
        mangaId: userManga.mangaId,
        rating: userManga.rating,
        readingStatus: userManga.readingStatus as any, // Cast to any because Drizzle expects its own enum type
        isFavorite: userManga.isFavorite,
        createdAt: userManga.createdAt,
        updatedAt: userManga.updatedAt,
      })
      .returning()

    return {
      id: result.id,
      userId: result.userId,
      mangaId: result.mangaId,
      rating: result.rating,
      readingStatus: result.readingStatus as ReadingStatus,
      isFavorite: result.isFavorite,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    }
  }

  async update(userManga: UserManga): Promise<UserManga> {
    const [result] = await this.db.client
      .update(userMangas)
      .set({
        readingStatus: userManga.readingStatus as any, // Cast to any because Drizzle expects its own enum type
        rating: userManga.rating,
        isFavorite: userManga.isFavorite,
        updatedAt: userManga.updatedAt,
      })
      .where(eq(userMangas.id, userManga.id))
      .returning()

    return {
      id: result.id,
      userId: result.userId,
      mangaId: result.mangaId,
      rating: result.rating,
      readingStatus: result.readingStatus as ReadingStatus,
      isFavorite: result.isFavorite,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    }
  }

  async findChapterProgress(
    userId: string,
    chapterId: string,
  ): Promise<UserChapterProgress | null> {
    const result = await this.db.client.query.userChapterProgress.findFirst({
      where: (ucp, { eq, and }) =>
        and(eq(ucp.userId, userId), eq(ucp.chapterId, chapterId)),
    })

    if (!result) return null

    return {
      id: result.id,
      userId: result.userId,
      chapterId: result.chapterId,
      readAt: result.readAt,
    }
  }

  async saveChapterProgress(
    userId: string,
    chapterId: string,
  ): Promise<UserChapterProgress> {
    // Upsert: if it already exists, return it; otherwise insert
    const existing = await this.findChapterProgress(userId, chapterId)
    if (existing) return existing

    const [result] = await this.db.client
      .insert(userChapterProgress)
      .values({ userId, chapterId })
      .returning()

    return {
      id: result.id,
      userId: result.userId,
      chapterId: result.chapterId,
      readAt: result.readAt,
    }
  }

  async deleteChapterProgress(
    userId: string,
    chapterId: string,
  ): Promise<void> {
    await this.db.client
      .delete(userChapterProgress)
      .where(
        and(
          eq(userChapterProgress.userId, userId),
          eq(userChapterProgress.chapterId, chapterId),
        ),
      )
  }
}
