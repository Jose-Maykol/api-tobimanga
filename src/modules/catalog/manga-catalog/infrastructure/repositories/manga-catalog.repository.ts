import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { DatabaseService } from '@/core/database/services/database.service'

import { MangaListItemDto } from '../../application/dtos/manga-list.dto'

@Injectable()
export class MangaCatalogRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  async findMangas(page: number, limit: number): Promise<MangaListItemDto[]> {
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
      where: (mangas, { eq }) => eq(mangas.active, true),
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

  async countMangas(): Promise<number> {
    const results = await this.db.client.query.mangas.findMany({
      columns: {
        id: true,
      },
      where: (mangas, { eq }) => eq(mangas.active, true),
    })

    return results.length
  }

  async findBySlug(slugName: string) {
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
    page: number,
    limit: number,
    order: 'ASC' | 'DESC',
  ) {
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
