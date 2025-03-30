import { UserManga } from '../entities/user-manga.entity'
import UserMangaRecord from '../types/user-manga'

type UserMangaProps = Omit<
  UserMangaRecord,
  'rating' | 'createdAt' | 'updatedAt'
>

export class UserMangaFactory {
  create(userManga: UserMangaProps): UserManga {
    return new UserManga({
      userId: userManga.userId,
      mangaId: userManga.mangaId,
      readingStatus: userManga.readingStatus,
      rating: 0,
      createdAt: new Date(),
      updatedAt: null,
    })
  }
}
