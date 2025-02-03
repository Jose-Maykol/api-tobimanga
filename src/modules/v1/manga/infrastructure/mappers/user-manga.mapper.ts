import { UserManga } from '../../domain/entities/user-manga.entity'

export class UserMangaMapper {
  static toPersistence(userManga: UserManga): any {
    return {
      userId: userManga.getUserId(),
      mangaId: userManga.getMangaId(),
      rating: userManga.getRating(),
      readingStatus: userManga.getReadingStatus(),
      createdAt: userManga.getCreatedAt(),
      updatedAt: userManga.getUpdatedAt(),
    }
  }
}
