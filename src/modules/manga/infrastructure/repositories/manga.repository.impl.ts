import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { MangaRepository } from '../../domain/repositories/manga.repository'
import { Manga } from '../../domain/entities/manga.entity'
import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { DatabaseService } from '@/core/database/services/database.service'
import { mangaAuthors } from '@/core/database/schemas/manga-author.schema'
import { mangaGenres } from '@/core/database/schemas/manga-genre.schema'
import { mangas } from '@/core/database/schemas/manga.schema'

/**
 * Implements write operations for Manga entity persistence.
 * Also provides composition read by slug to return the full domain entity.
 */
@Injectable()
export class MangaRepositoryImpl implements MangaRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  /**
   * Persist a new Manga entity and its associations.
   * @param manga Manga entity to persist
   * @returns Promise<Manga>
   */
  async save(manga: Manga): Promise<Manga> {
    await this.db.client.insert(mangas).values({
      id: manga.id,
      demographicId: manga.demographic.id,
      originalName: manga.originalName,
      slugName: manga.slugName,
      scrappingName: manga.scrappingName,
      alternativeNames: manga.alternativeNames,
      sinopsis: manga.sinopsis,
      chapters: manga.chapters,
      releaseDate: manga.releaseDate ? manga.releaseDate.toISOString() : null,
      coverImage: manga.coverImage,
      bannerImage: manga.bannerImage,
      publicationStatus: manga.publicationStatus,
      rating: manga.rating,
      active: manga.active,
    })

    if (manga.authors.length > 0) {
      await this.db.client.insert(mangaAuthors).values(
        manga.authors.map((author) => ({
          mangaId: manga.id,
          authorId: author.id,
        })),
      )
    }

    if (manga.genres.length > 0) {
      await this.db.client.insert(mangaGenres).values(
        manga.genres.map((genre) => ({
          mangaId: manga.id,
          genreId: genre.id,
        })),
      )
    }

    return {
      id: manga.id,
      originalName: manga.originalName,
      slugName: manga.slugName,
      scrappingName: manga.scrappingName,
      alternativeNames: manga.alternativeNames,
      sinopsis: manga.sinopsis,
      chapters: manga.chapters,
      releaseDate: manga.releaseDate,
      coverImage: manga.coverImage,
      bannerImage: manga.bannerImage,
      publicationStatus: manga.publicationStatus,
      rating: manga.rating,
      active: manga.active,
      authors: manga.authors,
      genres: manga.genres,
      demographic: manga.demographic,
      createdAt: manga.createdAt,
      updatedAt: manga.updatedAt,
    }
  }

  /**
   * Check if a manga exists by its slug.
   * @param slugName Slug identifier for the manga
   * @returns Promise<boolean> True if exists, false otherwise
   */
  async existBySlugName(slugName: string): Promise<boolean> {
    const result = await this.db.client
      .select({ id: mangas.id })
      .from(mangas)
      .where(eq(mangas.slugName, slugName))
      .limit(1)
    return result.length > 0
  }
}
