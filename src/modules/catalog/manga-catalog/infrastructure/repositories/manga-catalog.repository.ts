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
      rating: result.rating,
      publicationStatus: result.publicationStatus,
      authors: result.authors.map((ma) => ma.author),
      genres: result.genres.map((mg) => mg.genre),
      demographic: result.demographic,
    }
  }
}
