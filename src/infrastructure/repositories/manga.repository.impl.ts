import { count, eq } from 'drizzle-orm'

import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
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

    const results = await this.db.client.query.mangas.findMany({
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
      limit,
      offset,
    })

    return results.map((result) => ({
      id: result.id,
      originalName: result.originalName,
      slugName: result.slugName,
      scrappingName: result.scrappingName,
      alternativeNames: result.alternativeNames,
      sinopsis: result.sinopsis,
      chapters: result.chapters,
      releaseDate: new Date(result.releaseDate),
      coverImage: result.coverImageUrl,
      bannerImage: result.bannerImageUrl,
      publicationStatus: result.publicationStatus as PublicationStatus,
      rating: result.rating,
      active: result.active,
      authors: result.authors.map((ma) => ma.author),
      genres: result.genres.map((mg) => mg.genre),
      demographic: result.demographic,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    }))
  }

  async countAll(): Promise<number> {
    const result = await this.db.client.select({ total: count() }).from(mangas)
    return result[0].total
  }

  async findById(id: string): Promise<Manga | null> {
    const result = await this.db.client.query.mangas.findFirst({
      where: eq(mangas.id, id),
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

    if (!result) {
      return null
    }

    return {
      id: result.id,
      originalName: result.originalName,
      slugName: result.slugName,
      scrappingName: result.scrappingName,
      alternativeNames: result.alternativeNames,
      sinopsis: result.sinopsis,
      chapters: result.chapters,
      releaseDate: new Date(result.releaseDate),
      coverImage: result.coverImageUrl,
      bannerImage: result.bannerImageUrl,
      publicationStatus: result.publicationStatus as PublicationStatus,
      rating: result.rating,
      active: result.active,
      authors: result.authors.map((ma) => ma.author),
      genres: result.genres.map((mg) => mg.genre),
      demographic: result.demographic,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    }
  }

  async update(manga: Manga): Promise<Manga> {
    await this.db.client
      .update(mangas)
      .set({
        demographicId: manga.demographic.id,
        originalName: manga.originalName,
        slugName: manga.slugName,
        scrappingName: manga.scrappingName,
        alternativeNames: manga.alternativeNames,
        sinopsis: manga.sinopsis,
        releaseDate: manga.releaseDate.toISOString(),
        coverImageUrl: manga.coverImage,
        bannerImageUrl: manga.bannerImage,
        publicationStatus: manga.publicationStatus,
        updatedAt: manga.updatedAt,
      })
      .where(eq(mangas.id, manga.id))

    await this.db.client
      .delete(mangaAuthors)
      .where(eq(mangaAuthors.mangaId, manga.id))
    await this.db.client
      .delete(mangaGenres)
      .where(eq(mangaGenres.mangaId, manga.id))

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
}
