import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindPaginatedAdminMangasQuery } from '../find-paginated-admin-mangas.query'
import { calculatePagination } from '@/common/utils/pagination.util'
import { MangaReadRepository } from '../../../infrastructure/repositories/read/manga-read.repository'

@QueryHandler(FindPaginatedAdminMangasQuery)
export class FindPaginatedAdminMangasHandler
  implements IQueryHandler<FindPaginatedAdminMangasQuery>
{
  constructor(private readonly mangaRespository: MangaReadRepository) {}

  async execute(query: FindPaginatedAdminMangasQuery) {
    const { page, limit } = query
    const { mangas, total } = await this.mangaRespository.findPaginated(
      page,
      limit,
    )

    return {
      mangas: mangas,
      pagination: calculatePagination(total, page, limit),
    }
  }
}
