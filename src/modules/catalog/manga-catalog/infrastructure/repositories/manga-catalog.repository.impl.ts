import { and, eq, exists, gte, ilike } from 'drizzle-orm'

import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { mangaAuthors } from '@/core/database/schemas/manga-author.schema'
import { mangaGenres } from '@/core/database/schemas/manga-genre.schema'
import { DatabaseService } from '@/core/database/services/database.service'

import { ChapterListItemDto } from '../../application/dtos/chapter-list.dto'
import {
  MangaDetailDto,
  MangaListItemDto,
} from '../../application/dtos/manga-list.dto'
import { FindChaptersDto } from '../../domain/dtos/find-chapters.dto'
import { FindMangasDto } from '../../domain/dtos/find-mangas.dto'
import { IMangaCatalogRepository } from '../../domain/repositories/manga-catalog.repository'

@Injectable()
export class MangaCatalogRepositoryImpl implements IMangaCatalogRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  async findMangas(params: FindMangasDto): Promise<MangaListItemDto[]> {
    const { page, limit, search, rating, genreId, authorId } = params
    const offset = (page - 1) * limit

    const results = await this.db.client.query.mangas.findMany({
      columns: {
        id: true,
        originalName: true,
        chapters: true,
        releaseDate: true,
        coverImageUrl: true,
        rating: true,
      },
      with: {
        genres: {
          columns: {},
          with: {
            genre: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
        demographic: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
      where: (mangas) => {
        const conditions = [eq(mangas.active, true)]

        if (search) {
          conditions.push(ilike(mangas.originalName, `%${search}%`))
        }

        if (rating) {
          conditions.push(gte(mangas.rating, rating))
        }

        if (genreId) {
          conditions.push(
            exists(
              this.db.client
                .select()
                .from(mangaGenres)
                .where(
                  and(
                    eq(mangaGenres.mangaId, mangas.id),
                    eq(mangaGenres.genreId, genreId),
                  ),
                ),
            ),
          )
        }

        if (authorId) {
          conditions.push(
            exists(
              this.db.client
                .select()
                .from(mangaAuthors)
                .where(
                  and(
                    eq(mangaAuthors.mangaId, mangas.id),
                    eq(mangaAuthors.authorId, authorId),
                  ),
                ),
            ),
          )
        }

        return and(...conditions)
      },
      limit,
      offset,
    })

    return results.map((result) => ({
      id: result.id,
      originalName: result.originalName,
      chapters: result.chapters,
      releaseDate: new Date(result.releaseDate),
      coverImage: result.coverImageUrl,
      rating: result.rating,
      genres: result.genres.map((mg) => mg.genre),
      demographic: result.demographic,
    }))
  }

  async countMangas(params: FindMangasDto): Promise<number> {
    const { search, rating, genreId, authorId } = params

    const results = await this.db.client.query.mangas.findMany({
      columns: {
        id: true,
      },
      where: (mangas) => {
        const conditions = [eq(mangas.active, true)]

        if (search) {
          conditions.push(ilike(mangas.originalName, `%${search}%`))
        }

        if (rating) {
          conditions.push(gte(mangas.rating, rating))
        }

        if (genreId) {
          conditions.push(
            exists(
              this.db.client
                .select()
                .from(mangaGenres)
                .where(
                  and(
                    eq(mangaGenres.mangaId, mangas.id),
                    eq(mangaGenres.genreId, genreId),
                  ),
                ),
            ),
          )
        }

        if (authorId) {
          conditions.push(
            exists(
              this.db.client
                .select()
                .from(mangaAuthors)
                .where(
                  and(
                    eq(mangaAuthors.mangaId, mangas.id),
                    eq(mangaAuthors.authorId, authorId),
                  ),
                ),
            ),
          )
        }

        return and(...conditions)
      },
    })

    return results.length
  }

  async findBySlug(slugName: string): Promise<MangaDetailDto | null> {
    const result = await this.db.client.query.mangas.findFirst({
      columns: {
        id: true,
        originalName: true,
        slugName: true,
        sinopsis: true,
        chapters: true,
        releaseDate: true,
        bannerImageUrl: true,
        rating: true,
        publicationStatus: true,
        coverImageUrl: true,
      },
      with: {
        authors: {
          columns: {},
          with: {
            author: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
        genres: {
          columns: {},
          with: {
            genre: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
        demographic: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
      where: (mangas, { eq, and }) =>
        and(eq(mangas.slugName, slugName), eq(mangas.active, true)),
    })

    if (!result) {
      return null
    }

    return {
      id: result.id,
      originalName: result.originalName,
      slugName: result.slugName,
      sinopsis: result.sinopsis,
      chapters: result.chapters,
      releaseDate: new Date(result.releaseDate),
      bannerImage: result.bannerImageUrl,
      coverImage: result.coverImageUrl,
      rating: result.rating,
      publicationStatus: result.publicationStatus,
      authors: result.authors.map((ma) => ma.author),
      genres: result.genres.map((mg) => mg.genre),
      demographic: result.demographic,
    }
  }

  async findMangaIdBySlug(slug: string): Promise<string | null> {
    const result = await this.db.client.query.mangas.findFirst({
      columns: {
        id: true,
      },
      where: (mangas, { eq, and }) =>
        and(eq(mangas.slugName, slug), eq(mangas.active, true)),
    })

    return result ? result.id : null
  }

  async findChaptersByMangaId(
    mangaId: string,
    params: FindChaptersDto,
  ): Promise<ChapterListItemDto[]> {
    const { page, limit, order } = params
    const offset = (page - 1) * limit

    const results = await this.db.client.query.chapters.findMany({
      columns: {
        id: true,
        chapterNumber: true,
        title: true,
        releaseDate: true,
      },
      where: (chapters, { eq }) => eq(chapters.mangaId, mangaId),
      orderBy: (chapters, { asc, desc }) =>
        order === 'ASC'
          ? asc(chapters.chapterNumber)
          : desc(chapters.chapterNumber),
      limit,
      offset,
    })

    return results.map((chapter) => ({
      id: chapter.id,
      chapterNumber: chapter.chapterNumber,
      title: chapter.title,
      releaseDate: chapter.releaseDate ? new Date(chapter.releaseDate) : null,
    }))
  }

  async countChaptersByMangaId(mangaId: string): Promise<number> {
    const results = await this.db.client.query.chapters.findMany({
      columns: {
        id: true,
      },
      where: (chapters, { eq }) => eq(chapters.mangaId, mangaId),
    })

    return results.length
  }
}
