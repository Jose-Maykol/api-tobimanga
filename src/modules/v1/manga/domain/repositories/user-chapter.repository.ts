import { UserChapter } from '../entities/user-chapter.entitiy'

export interface UserChapterRepository {
  save(chapter: UserChapter): Promise<void>
  update(chapter: UserChapter): Promise<void>
}
