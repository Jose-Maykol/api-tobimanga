import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindPaginatedChaptersQuery } from '../find-paginated-chapters.query'
import { MangaRepository } from '../../../domain/repositories/manga.repository'
import { Inject } from '@nestjs/common'
import { calculatePagination } from '@/common/utils/pagination.util'

@QueryHandler(FindPaginatedChaptersQuery)
export class FindPaginatedChaptersHandler
  implements IQueryHandler<FindPaginatedChaptersQuery>
{
  constructor(
    @Inject('MangaRepository')
    private readonly mangaRepository: MangaRepository,
  ) {}

  async execute(query: FindPaginatedChaptersQuery) {
    const { page, limit, mangaId } = query

    const [chapters, total] =
      await this.mangaRepository.findPaginatedChaptersByMangaId(
        mangaId,
        page,
        limit,
      )

    return {
      chapters,
      pagination: calculatePagination(total.count, page, limit),
    }
  }
}
