import { UserManga } from '../../domain/entities/user-manga.entity'
import UserMangaRecord from '../../domain/types/user-manga'

export class UserMangaMapper {
  static toPersistence(userManga: UserManga): UserMangaRecord {
    return {
      userId: userManga.userId,
      mangaId: userManga.mangaId,
      rating: userManga.rating,
      readingStatus: userManga.readingStatus,
      createdAt: userManga.createdAt,
      updatedAt: userManga.updatedAt,
    }
  }

  static toDomain(userManga: any): UserManga {
    return new UserManga({
      userId: userManga.userId,
      mangaId: userManga.mangaId,
      rating: userManga.rating,
      readingStatus: userManga.readingStatus,
      createdAt: userManga.createdAt,
      updatedAt: userManga.updatedAt,
    })
  }
}
