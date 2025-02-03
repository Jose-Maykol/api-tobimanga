import { UserManga } from '../entities/user-manga.entity'

export interface UserMangaRepository {
  save(userManga: UserManga): Promise<void>
  createChapters(userId: string, mangaId: string): Promise<void>
}
