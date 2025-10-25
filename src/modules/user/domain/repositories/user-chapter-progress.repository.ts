import { UserChapterProgress } from '../../../../core/domain/entities/user-chapter-progress.entity'

export interface UserChapterProgressRepository {
  findByUserAndChapter(
    userId: string,
    chapterId: string,
  ): Promise<UserChapterProgress | null>
  save(progress: UserChapterProgress): Promise<UserChapterProgress>
  deleteById(id: string): Promise<void>
}
