import { and, desc, eq, sql } from 'drizzle-orm'

import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { mangas } from '@/core/database/schemas/manga.schema'
import { userMangas } from '@/core/database/schemas/user-manga.schema'
import { DatabaseService } from '@/core/database/services/database.service'

import { UserFavoriteMangaReadModel } from '../../domain/read-models/user-favorite-manga.read-model'
import {
  FindFavoritesOptions,
  FindFavoritesResult,
  IUserContentQueryRepository,
} from '../../domain/repositories/user-content-query.repository'
import { ReadingStatus } from '../../domain/value-objects/reading-status.vo'

@Injectable()
export class UserContentQueryRepositoryImpl
  implements IUserContentQueryRepository
{
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  async findFavoritesByUser(
    userId: string,
    options: FindFavoritesOptions = {},
  ): Promise<FindFavoritesResult> {
    const { limit = 20, offset = 0, sortOrder = 'desc' } = options

    // Query optimizada con JOIN
    const results = await this.db.client
      .select({
        // UserManga fields
        userMangaId: userMangas.id,
        readingStatus: userMangas.readingStatus,
        rating: userMangas.rating,
        favoritedAt: userMangas.updatedAt,

        // Manga fields (desnormalizados)
        id: mangas.id,
        title: mangas.originalName,
        coverUrl: mangas.coverImageUrl,
        synopsis: mangas.sinopsis,
        publicationStatus: mangas.publicationStatus,
        updatedAt: mangas.updatedAt,
      })
      .from(userMangas)
      .innerJoin(mangas, eq(userMangas.mangaId, mangas.id))
      .where(
        and(eq(userMangas.userId, userId), eq(userMangas.isFavorite, true)),
      )
      .orderBy(
        sortOrder === 'desc'
          ? desc(userMangas.updatedAt)
          : userMangas.updatedAt,
      )
      .limit(limit)
      .offset(offset)

    // Count total (para paginación)
    const [countResult] = await this.db.client
      .select({ count: sql<number>`count(*)::int` })
      .from(userMangas)
      .where(
        and(eq(userMangas.userId, userId), eq(userMangas.isFavorite, true)),
      )

    return {
      items: results.map(
        (r): UserFavoriteMangaReadModel => ({
          id: r.id,
          userMangaId: r.userMangaId,
          title: r.title,
          coverUrl: r.coverUrl,
          synopsis: r.synopsis,
          publicationStatus: r.publicationStatus,
          readingStatus: r.readingStatus as ReadingStatus,
          rating: r.rating,
          lastReadChapter: null, // TODO: agregar si tienes tabla de progreso
          favoritedAt: r.favoritedAt ?? new Date(),
          updatedAt: r.updatedAt,
        }),
      ),
      total: countResult?.count ?? 0,
    }
  }
}
