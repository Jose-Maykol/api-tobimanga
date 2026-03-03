import { UserChapterProgress } from '../entities/user-chapter-progress.entity'
import { UserManga } from '../entities/user-manga.entity'

export interface IUserContentRepository {
  findByUserAndManga(userId: string, mangaId: string): Promise<UserManga | null>
  save(userManga: Omit<UserManga, 'id'>): Promise<UserManga>
  update(userManga: UserManga): Promise<UserManga>

  findChapterProgress(
    userId: string,
    chapterId: string,
  ): Promise<UserChapterProgress | null>
  saveChapterProgress(
    userId: string,
    chapterId: string,
  ): Promise<UserChapterProgress>
  deleteChapterProgress(userId: string, chapterId: string): Promise<void>
}
