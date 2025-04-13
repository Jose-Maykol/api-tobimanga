import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindPaginatedChaptersQuery } from '../find-paginated-chapters.query'
import { MangaRepository } from '../../../domain/repositories/manga.repository'
import { Inject } from '@nestjs/common'

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

    const calculatePagination = (
      total: number,
      page: number,
      limit: number,
    ) => {
      const pages = Math.ceil(total / limit)
      return {
        total,
        perPage: limit,
        currentPage: page,
        pages,
        hasNextPage: page < pages,
        hasPreviousPage: page > 1,
      }
    }

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
