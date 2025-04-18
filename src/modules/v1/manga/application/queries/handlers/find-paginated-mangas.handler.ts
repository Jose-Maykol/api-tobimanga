import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindPaginatedMangasQuery } from '../find-paginated-mangas.query'
import { MangaRepository } from '../../../domain/repositories/manga.repository'
import { Inject, NotFoundException } from '@nestjs/common'

@QueryHandler(FindPaginatedMangasQuery)
export class FindPaginatedMangasHandler
  implements IQueryHandler<FindPaginatedMangasQuery>
{
  constructor(
    @Inject('MangaRepository')
    private readonly mangaRepository: MangaRepository,
  ) {}

  async execute(query: FindPaginatedMangasQuery) {
    const { page, limit } = query
    const [mangas, total] = await this.mangaRepository.findPaginated(
      page,
      limit,
    )

    if (mangas.length === 0) {
      throw new NotFoundException('No se encontraron mangas')
    }

    const pages = Math.ceil(total.count / limit)
    const hasNextPage = page < pages
    const hasPreviousPage = page > 1

    const pagination = {
      total: total.count,
      perPage: limit,
      currentPage: page,
      pages,
      hasNextPage,
      hasPreviousPage,
    }

    return {
      mangas,
      pagination,
    }
  }
}
