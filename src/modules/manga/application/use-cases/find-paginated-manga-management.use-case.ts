import { Inject, Injectable } from '@nestjs/common'
import { MangaReadRepository } from '../../infrastructure/repositories/manga.read.repository'
import { calculatePagination } from '@/common/utils/pagination.util'
import { Pagination } from '@/common/interfaces/pagination.interface'
import { MangaManagementListItemDto } from '../dtos/manga-management-list-item.dto'

/**
 * Use case for retrieving paginated manga management items with pagination metadata.
 */
@Injectable()
export class FindPaginatedMangaManagementUseCase {
  constructor(
    @Inject()
    private readonly mangaRepository: MangaReadRepository,
  ) {}

  /**
   * Retrieve paginated manga management items and pagination metadata.
   * @param page Current page number (default: 1)
   * @param limit Number of items per page (default: 20)
   * @returns Promise containing items and pagination metadata
   */
  async execute(
    page: number = 1,
    limit: number = 20,
  ): Promise<{ items: MangaManagementListItemDto[]; pagination: Pagination }> {
    const { items, total } = await this.mangaRepository.findManagementPaginated(
      page,
      limit,
    )
    const pagination: Pagination = calculatePagination(total, page, limit)
    return { items, pagination }
  }
}
