import { UserFavoriteMangaReadModel } from '../read-models/user-favorite-manga.read-model'

export interface FindFavoritesOptions {
  limit?: number
  offset?: number
  sortBy?: 'favoritedAt' | 'title' | 'rating'
  sortOrder?: 'asc' | 'desc'
}

export interface FindFavoritesResult {
  items: UserFavoriteMangaReadModel[]
  total: number
}

export interface IUserContentQueryRepository {
  findFavoritesByUser(
    userId: string,
    options?: FindFavoritesOptions,
  ): Promise<FindFavoritesResult>
}
