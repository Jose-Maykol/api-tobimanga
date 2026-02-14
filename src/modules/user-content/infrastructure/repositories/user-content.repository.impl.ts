import { eq } from 'drizzle-orm'

import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { userMangas } from '@/core/database/schemas/user-manga.schema'
import { DatabaseService } from '@/core/database/services/database.service'

import { UserManga } from '../../domain/entities/user-manga.entity'
import { IUserContentRepository } from '../../domain/repositories/user-content.repository'
import { ReadingStatus } from '../../domain/value-objects/reading-status.vo'

@Injectable()
export class UserContentRepositoryImpl implements IUserContentRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) { }

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
}
