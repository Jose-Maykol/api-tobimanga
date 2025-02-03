import { UserManga } from '../entities/user-manga.entity'
import { MangaReadingStatus } from '../enums/manga-reading-status.enum'

type UserMangaProps = {
  userId: string
  mangaId: string
  rating?: number
  readingStatus: MangaReadingStatus
}

export class UserMangaFactory {
  create(userManga: UserMangaProps): any {
    return new UserManga({
      userId: userManga.userId,
      mangaId: userManga.mangaId,
      rating: userManga.rating || 0,
      readingStatus: userManga.readingStatus,
    })
  }
}
