import { UserManga } from '../entities/user-manga.entity'

export interface UserMangaRepository {
  save(userManga: UserManga): Promise<void>
  find(mangaId: string, userId: string): Promise<UserManga | null>
}
