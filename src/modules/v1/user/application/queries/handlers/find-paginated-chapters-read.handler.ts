import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindPaginatedChaptersReadQuery } from "../find-paginated-chapters-read.query";
import { Inject } from "@nestjs/common";
import { UserMangaRepository } from "../../../domain/repositories/user-manga.repository";
import { MangaRepository } from "../../../../manga/domain/repositories/manga.repository";
import { calculatePagination } from "@/common/utils/pagination.util";


@QueryHandler(FindPaginatedChaptersReadQuery)
export class FindPaginatedChaptersReadHandler
  implements IQueryHandler<FindPaginatedChaptersReadQuery> 
{
  constructor(
    /* @Inject('MangaRepository')
        private readonly mangaRepository: MangaRepository, */
    @Inject('UserMangaRepository')
    private readonly userMangaRepository: UserMangaRepository,
  ) {}

  async execute(query: FindPaginatedChaptersReadQuery) {
    const {
      page,
      limit,
      mangaId,
      userId,
    } = query

    if (!userId) {
      throw new Error("userId is required")
    }

    const [chapters, total] = await this.userMangaRepository.findPaginatedChaptersReadByMangaId(
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
}