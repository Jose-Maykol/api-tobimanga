import { UserChapter } from '../../domain/entities/user-chapter.entitiy'
import UserChapterRecord from '../../domain/types/user-chapter'

export class UserChapterMapper {
  static toPersistence(chapter: UserChapter): UserChapterRecord {
    return {
      userId: chapter.userId,
      chapterId: chapter.chapterId,
      read: chapter.read,
      readAt: chapter.readAt,
      createdAt: chapter.createdAt,
      updatedAt: chapter.updatedAt,
    }
  }

  static toDomain(chapter: UserChapterRecord): UserChapter {
    return new UserChapter({
      userId: chapter.userId,
      chapterId: chapter.chapterId,
      read: chapter.read,
      readAt: chapter.readAt,
      createdAt: chapter.createdAt,
      updatedAt: chapter.updatedAt,
    })
  }
}
