import { ReadingStatusEnum, UsuarioManga } from '../entities/user-manga.entity'

type UsuarioMangaProps = {
  userId: string
  mangaId: string
  rating?: number
  readingStatus: ReadingStatusEnum
}

export class UserMangaFactory {
  create(usuarioManga: UsuarioMangaProps): any {
    return new UsuarioManga({
      userId: usuarioManga.userId,
      mangaId: usuarioManga.mangaId,
      rating: usuarioManga.rating || 0,
      readingStatus: usuarioManga.readingStatus,
    })
  }
}
