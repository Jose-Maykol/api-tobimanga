import { count } from 'drizzle-orm'

import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { mangas } from '@/core/database/schemas/manga.schema'
import { DatabaseService } from '@/core/database/services/database.service'

import { MangaListItemDto } from '../../application/dtos/manga-list-item.dto'
import { MangaManagementListItemDto } from '../../application/dtos/manga-management-list-item.dto'

@Injectable()
export class MangaReadRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  /**
   * Retrieve paginated manga items for public listing.
   * @param page Current page number (1-based)
   * @param limit Number of items per page
   * @returns Promise with items and total count for pagination
   */
  async findPaginated(
    page: number,
    limit: number,
  ): Promise<{ items: MangaListItemDto[]; total: number }> {
    const offset: number = (page - 1) * limit
    const [items, total] = await Promise.all([
      this.db.client
        .select({
          id: mangas.id,
          name: mangas.originalName,
          slugName: mangas.slugName,
          scrappingName: mangas.scrappingName,
          chapters: mangas.chapters,
          rating: mangas.rating,
          coverImage: mangas.coverImageUrl,
        })
        .from(mangas)
        .limit(limit)
        .offset(offset),
      this.countAll(),
    ])
    return { items: items as MangaListItemDto[], total }
  }

  /**
   * Count total number of manga records in the database.
   * Used for pagination metadata.
   * @returns Promise with total manga count
   */
  async countAll(): Promise<number> {
    const [result] = await this.db.client
      .select({ count: count(mangas.id) })
      .from(mangas)

    return result?.count ?? 0
  }

  /**
   * Retrieve paginated manga items for management listing.
   * Includes additional fields for admin/management views.
   * @param page Current page number (1-based)
   * @param limit Number of items per page
   * @returns Promise with items and total count for pagination
   */
  async findManagementPaginated(
    page: number,
    limit: number,
  ): Promise<{ items: MangaManagementListItemDto[]; total: number }> {
    const offset: number = (page - 1) * limit
    const [items, total] = await Promise.all([
      this.db.client
        .select({
          id: mangas.id,
          name: mangas.originalName,
          slugName: mangas.slugName,
          chapters: mangas.chapters,
          rating: mangas.rating,
          publicationStatus: mangas.publicationStatus,
          coverImage: mangas.coverImageUrl,
          active: mangas.active,
          createdAt: mangas.createdAt,
          updatedAt: mangas.updatedAt,
        })
        .from(mangas)
        .limit(limit)
        .offset(offset),
      this.countAll(),
    ])
    return { items: items as MangaManagementListItemDto[], total }
  }
}
