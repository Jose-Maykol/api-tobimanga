import { count, eq } from 'drizzle-orm'

import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { demographics } from '@/core/database/schemas/demographic.schema'
import { mangas } from '@/core/database/schemas/manga.schema'
import { mangaAuthors } from '@/core/database/schemas/manga-author.schema'
import { mangaGenres } from '@/core/database/schemas/manga-genre.schema'
import { DatabaseService } from '@/core/database/services/database.service'
import { Manga } from '@/core/domain/entities/manga.entity'
import { MangaRepository } from '@/core/domain/repositories/manga.repository'
import { PublicationStatus } from '@/modules/manga/application/enums/publication-status.enum'

@Injectable()
export class MangaRepositoryImpl implements MangaRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

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
      releaseDate: manga.releaseDate.toISOString(),
      coverImageUrl: manga.coverImage,
      bannerImageUrl: manga.bannerImage,
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

  async existBySlugName(slugName: string): Promise<boolean> {
    const result = await this.db.client
      .select({ id: mangas.id })
      .from(mangas)
      .where(eq(mangas.slugName, slugName))
      .limit(1)
    return result.length > 0
  }

  async findAll(page: number, limit: number): Promise<Manga[]> {
    const offset = (page - 1) * limit

    const results = await this.db.client
      .select({
        manga: mangas,
        authors: mangaAuthors,
        genres: mangaGenres,
        demographic: demographics,
      })
      .from(mangas)
      .innerJoin(mangaAuthors, eq(mangas.id, mangaAuthors.mangaId))
      .innerJoin(mangaGenres, eq(mangas.id, mangaGenres.mangaId))
      .innerJoin(demographics, eq(mangas.demographicId, demographics.id))
      .limit(limit)
      .offset(offset)

    return results.map((result) => ({
      id: result.manga.id,
      originalName: result.manga.originalName,
      slugName: result.manga.slugName,
      scrappingName: result.manga.scrappingName,
      alternativeNames: result.manga.alternativeNames,
      sinopsis: result.manga.sinopsis,
      chapters: result.manga.chapters,
      releaseDate: new Date(result.manga.releaseDate),
      coverImage: result.manga.coverImageUrl,
      bannerImage: result.manga.bannerImageUrl,
      publicationStatus: result.manga.publicationStatus as PublicationStatus,
      rating: result.manga.rating,
      active: result.manga.active,
      authors: [],
      genres: [],
      demographic: result.demographic,
      createdAt: result.manga.createdAt,
      updatedAt: result.manga.updatedAt,
    }))
  }

  async countAll(): Promise<number> {
    const result = await this.db.client.select({ total: count() }).from(mangas)
    return result[0].total
  }
}
