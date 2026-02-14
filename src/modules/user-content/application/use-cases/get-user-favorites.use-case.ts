import { Inject, Injectable } from '@nestjs/common'

import { UserFavoriteMangaReadModel } from '../../domain/read-models/user-favorite-manga.read-model'
import { IUserContentQueryRepository } from '../../domain/repositories/user-content-query.repository'
import { USER_CONTENT_QUERY_REPOSITORY } from '../../domain/tokens'

export interface GetUserFavoritesParams {
  userId: string
  page?: number
  pageSize?: number
  sortBy?: 'favoritedAt' | 'title' | 'rating'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationMetadata {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface GetUserFavoritesResult {
  favorites: UserFavoriteMangaReadModel[]
  pagination: PaginationMetadata
}

@Injectable()
export class GetUserFavoritesUseCase {
  constructor(
    @Inject(USER_CONTENT_QUERY_REPOSITORY)
    private readonly queryRepository: IUserContentQueryRepository,
  ) {}

  async execute(
    params: GetUserFavoritesParams,
  ): Promise<GetUserFavoritesResult> {
    const { userId, page = 1, pageSize = 20, sortBy, sortOrder } = params
    const offset = (page - 1) * pageSize

    const { items, total } = await this.queryRepository.findFavoritesByUser(
      userId,
      {
        limit: pageSize,
        offset,
        sortBy,
        sortOrder,
      },
    )

    return {
      favorites: items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    }
  }
}
