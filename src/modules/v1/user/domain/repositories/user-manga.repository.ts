import { UserManga } from '../entities/user-manga.entity'
import ChapterRecord from '../../../manga/domain/types/chapter'

export interface UserMangaRepository {
  save(userManga: UserManga): Promise<void>
  find(mangaId: string, userId: string): Promise<UserManga | null>
  findPaginatedChaptersReadByMangaId(
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
