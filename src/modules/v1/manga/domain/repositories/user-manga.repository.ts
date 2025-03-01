import { UserManga } from '../entities/user-manga.entity'
import ChapterRecord from '../types/chapter'

export interface UserMangaRepository {
  save(userManga: UserManga): Promise<void>
  find(mangaId: string, userId: string): Promise<UserManga | null>
  findPaginatedChaptersReadingTrackingByMangaId(
    mangaId: string,
    page: number,
    limit: number,
    userId: string,
  ): Promise<
    [
      Partial<ChapterRecord & { readAt: Date | null; read: boolean }>[],
      { count: number },
    ]
  >
}
