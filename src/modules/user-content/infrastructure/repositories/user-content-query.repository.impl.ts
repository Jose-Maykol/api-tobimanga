import { and, desc, eq, sql } from 'drizzle-orm'

import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { chapters } from '@/core/database/schemas/chapter.schema'
import { mangas } from '@/core/database/schemas/manga.schema'
import { userChapterProgress } from '@/core/database/schemas/user-chapter-progress.schema'
import { userMangas } from '@/core/database/schemas/user-manga.schema'
import { DatabaseService } from '@/core/database/services/database.service'
import { PublicationStatus } from '@/modules/admin/manga-management/domain/value-objects/publication-status.vo'

import { UserChapterListReadModel } from '../../domain/read-models/user-chapter-list.read-model'
import { UserFavoriteMangaReadModel } from '../../domain/read-models/user-favorite-manga.read-model'
import { UserMangaDetailReadModel } from '../../domain/read-models/user-manga-detail.read-model'
import {
  FindChaptersOptions,
  FindChaptersResult,
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

  async findUserMangaDetailBySlug(
    userId: string,
    slug: string,
  ): Promise<UserMangaDetailReadModel | null> {
    const manga = await this.db.client.query.mangas.findFirst({
      where: (mangas, { eq, and }) =>
        and(eq(mangas.slugName, slug), eq(mangas.active, true)),
      with: {
        authors: {
          with: {
            author: true,
          },
        },
        genres: {
          with: {
            genre: true,
          },
        },
        demographic: true,
      },
    })

    if (!manga) {
      return null
    }

    const userManga = await this.db.client.query.userMangas.findFirst({
      where: (userMangas, { eq, and }) =>
        and(eq(userMangas.userId, userId), eq(userMangas.mangaId, manga.id)),
    })

    return {
      id: manga.id,
      title: manga.originalName,
      slug: manga.slugName,
      synopsis: manga.sinopsis,
      coverUrl: manga.coverImageUrl,
      bannerUrl: manga.bannerImageUrl,
      publicationStatus: manga.publicationStatus as PublicationStatus,
      authors: manga.authors.map((ma) => ({
        id: ma.author.id,
        name: ma.author.name,
      })),
      genres: manga.genres.map((mg) => ({
        id: mg.genre.id,
        name: mg.genre.name,
      })),
      demographic: manga.demographic
        ? { id: manga.demographic.id, name: manga.demographic.name }
        : null,

      // User specific fields
      isFavorite: userManga?.isFavorite ?? false,
      readingStatus:
        (userManga?.readingStatus as ReadingStatus) ??
        ReadingStatus.PLANNING_TO_READ,
      rating: userManga?.rating ?? null,
      startedAt: null, // TODO: Implement if progress tracking exists
      finishedAt: null, // TODO: Implement if progress tracking exists
      updatedAt: userManga?.updatedAt ?? null,
    }
  }

  async findChaptersByMangaSlug(
    userId: string,
    slug: string,
    options: FindChaptersOptions = {},
  ): Promise<FindChaptersResult | null> {
    const { limit = 20, offset = 0, sortOrder = 'desc' } = options

    const manga = await this.db.client.query.mangas.findFirst({
      where: (mangas, { eq }) => eq(mangas.slugName, slug),
      columns: { id: true },
    })

    if (!manga) {
      return null
    }

    const results = await this.db.client
      .select({
        id: chapters.id,
        chapterNumber: chapters.chapterNumber,
        title: chapters.title,
        releaseDate: chapters.releaseDate,
        readAt: userChapterProgress.readAt,
      })
      .from(chapters)
      .leftJoin(
        userChapterProgress,
        and(
          eq(userChapterProgress.chapterId, chapters.id),
          eq(userChapterProgress.userId, userId),
        ),
      )
      .where(eq(chapters.mangaId, manga.id))
      .orderBy(
        sortOrder === 'desc'
          ? desc(chapters.chapterNumber)
          : chapters.chapterNumber,
      )
      .limit(limit)
      .offset(offset)

    const [countResult] = await this.db.client
      .select({ count: sql<number>`count(*)::int` })
      .from(chapters)
      .where(eq(chapters.mangaId, manga.id))

    return {
      items: results.map((r) => ({
        id: r.id,
        chapterNumber: r.chapterNumber,
        title: r.title,
        releaseDate: r.releaseDate ? new Date(r.releaseDate) : null,
        isRead: !!r.readAt,
        readAt: r.readAt,
      })),
      total: countResult?.count ?? 0,
    }
  }
}
