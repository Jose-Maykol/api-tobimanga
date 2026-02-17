import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'

import { calculatePagination } from '@/common/utils/pagination.util'

import { IUserContentQueryRepository } from '../../domain/repositories/user-content-query.repository'
import { USER_CONTENT_QUERY_REPOSITORY } from '../../domain/tokens'
import { ListUserChaptersDto } from '../dtos/list-user-chapters.dto'

@Injectable()
export class ListChaptersByMangaSlugUseCase {
  private readonly logger = new Logger(ListChaptersByMangaSlugUseCase.name)

  constructor(
    @Inject(USER_CONTENT_QUERY_REPOSITORY)
    private readonly userContentQueryRepository: IUserContentQueryRepository,
  ) {}

  async execute(userId: string, slug: string, dto: ListUserChaptersDto) {
    const { page = 1, limit = 20, order = 'DESC' } = dto
    const offset = (page - 1) * limit

    const result =
      await this.userContentQueryRepository.findChaptersByMangaSlug(
        userId,
        slug,
        {
          limit,
          offset,
          sortOrder: order.toLowerCase() as 'asc' | 'desc',
        },
      )

    if (!result) {
      this.logger.warn(`Manga with slug ${slug} not found`)
      throw new NotFoundException(`Manga with slug ${slug} not found`)
    }

    const { items, total } = result

    const meta = calculatePagination(total, page, limit)

    return { items, meta }
  }
}
