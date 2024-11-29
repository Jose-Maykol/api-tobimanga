import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindPaginatedChaptersQuery } from '../find-paginated-chapters.query'
import { MangaRepository } from '../../../domain/repositories/manga.repository'
import { Inject, NotFoundException } from '@nestjs/common'

@QueryHandler(FindPaginatedChaptersQuery)
export class FindPaginatedChaptersHandler
  implements IQueryHandler<FindPaginatedChaptersQuery>
{
  constructor(
    @Inject('MangaRepository')
    private readonly mangaRepository: MangaRepository,
  ) {}

  async execute(query: FindPaginatedChaptersQuery) {
    const { page, limit, slug } = query
    const title = slug.replace(/-/g, ' ')
    const [chapters, total] =
      await this.mangaRepository.findPaginatedChaptersByMangaTitle(
        title,
        page,
        limit,
      )

    if (chapters.length === 0) {
      throw new NotFoundException('No se encontraron capítulos para este manga')
    }

    const pages = Math.ceil(total[0].count / limit)
    const hasNextPage = page < pages
    const hasPreviousPage = page > 1

    const pagination = {
      total: total[0].count,
      perPage: limit,
      currentPage: page,
      pages,
      hasNextPage,
      hasPreviousPage,
    }

    return {
      chapters,
      pagination,
    }
  }
}
