import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindPaginatedChaptersQuery } from '../find-paginated-chapters.query'
import { MangaRepository } from '../../../domain/repositories/manga.repository'
import { Inject } from '@nestjs/common'
import { UserMangaRepository } from '../../../domain/repositories/user-manga.repository'

@QueryHandler(FindPaginatedChaptersQuery)
export class FindPaginatedChaptersHandler
  implements IQueryHandler<FindPaginatedChaptersQuery>
{
  constructor(
    @Inject('MangaRepository')
    private readonly mangaRepository: MangaRepository,
    @Inject('UserMangaRepository')
    private readonly userMangaRepository: UserMangaRepository,
  ) {}

  async execute(query: FindPaginatedChaptersQuery) {
    const { page, limit, mangaId, userId } = query

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

    if (userId) {
      const [chapters, total] =
        await this.userMangaRepository.findPaginatedChaptersReadingTrackingByMangaId(
          mangaId,
          page,
          limit,
          userId,
        )

      return {
        chapters,
        pagination: calculatePagination(total.count, page, limit),
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
