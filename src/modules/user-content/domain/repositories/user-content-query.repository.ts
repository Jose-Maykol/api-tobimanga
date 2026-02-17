import { UserChapterListReadModel } from '../read-models/user-chapter-list.read-model'
import { UserFavoriteMangaReadModel } from '../read-models/user-favorite-manga.read-model'
import { UserMangaDetailReadModel } from '../read-models/user-manga-detail.read-model'

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

export interface FindChaptersOptions {
  limit?: number
  offset?: number
  sortOrder?: 'asc' | 'desc'
}

export interface FindChaptersResult {
  items: UserChapterListReadModel[]
  total: number
}

export interface IUserContentQueryRepository {
  findFavoritesByUser(
    userId: string,
    options?: FindFavoritesOptions,
  ): Promise<FindFavoritesResult>

  findUserMangaDetailBySlug(
    userId: string,
    slug: string,
  ): Promise<UserMangaDetailReadModel | null>

  findChaptersByMangaSlug(
    userId: string,
    slug: string,
    options?: FindChaptersOptions,
  ): Promise<FindChaptersResult | null>
}
