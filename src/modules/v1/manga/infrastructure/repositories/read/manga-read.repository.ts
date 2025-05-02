import { mangas } from '@/modules/database/schemas/manga.schema'
import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { Injectable } from '@nestjs/common'
import { sql } from 'drizzle-orm'
import { PaginatedAdminMangaDto } from '../../../application/dto/manga.dto'

@Injectable()
export class MangaReadRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findPaginated(
    page: number,
    limit: number,
  ): Promise<PaginatedAdminMangaDto> {
    const offset = (page - 1) * limit
    const paginatedMangas = await this.drizzle.db
      .select({
        id: mangas.id,
        originalName: mangas.originalName,
        chapters: mangas.chapters,
        rating: mangas.rating,
        coverImage: mangas.coverImage,
        publicationStatus: mangas.publicationStatus,
        active: mangas.active,
        updatedAt: mangas.updatedAt,
        total: sql<number>`count(*) over()`.as('total'),
      })
      .from(mangas)
      .offset(offset)
      .limit(limit)
    return {
      mangas: paginatedMangas.map((manga) => ({
        id: manga.id,
        originalName: manga.originalName,
        chapters: manga.chapters,
        rating: manga.rating,
        coverImage: manga.coverImage ?? '',
        publicationStatus: manga.publicationStatus,
        active: manga.active,
        updatedAt: manga.updatedAt,
      })),
      total: paginatedMangas[0]?.total ?? 0,
    }
  }
}
