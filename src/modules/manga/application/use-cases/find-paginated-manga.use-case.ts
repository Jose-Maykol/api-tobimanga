import { Inject, Injectable } from '@nestjs/common'
import { MangaReadRepository } from '../../infrastructure/repositories/manga.read.repository'
import { MangaListItemDto } from '../dtos/manga-list-item.dto'
import { calculatePagination } from '@/common/utils/pagination.util'
import { Pagination } from '@/common/interfaces/pagination.interface'

/**
 * Use case for retrieving paginated mangas and pagination metadata.
 */
@Injectable()
export class FindPaginatedMangaUseCase {
  constructor(
    @Inject()
    private readonly mangaRepository: MangaReadRepository,
  ) {}

  /**
   * Retrieve paginated mangas and pagination metadata.
   * @param page Current page number (default: 1)
   * @param limit Number of items per page (default: 10)
   * @returns Promise<{ items: MangaListItemDto[]; pagination: Pagination }>
   */
  async execute(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ items: MangaListItemDto[]; pagination: Pagination }> {
    const { items, total } = await this.mangaRepository.findPaginated(
      page,
      limit,
    )
    const pagination: Pagination = calculatePagination(total, page, limit)
    return { items, pagination }
  }
}
