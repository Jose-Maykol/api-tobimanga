import { UsuarioManga } from '../entities/user-manga.entity'
import { MangaReadingStatus } from '../enums/manga-reading-status.enum'

type UsuarioMangaProps = {
  userId: string
  mangaId: string
  rating?: number
  readingStatus: MangaReadingStatus
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
