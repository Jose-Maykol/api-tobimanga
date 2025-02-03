import { MangaReadingStatus } from '../enums/manga-reading-status.enum'

type UsuarioMangaProps = {
  id?: string
  userId: string
  mangaId: string
  rating?: number
  readingStatus: MangaReadingStatus
  createdAt?: Date
  updatedAt?: Date
}

export class UsuarioManga {
  private userId: string
  private mangaId: string
  private rating?: number
  private readingStatus: MangaReadingStatus
  private createdAt: Date
  private updatedAt?: Date

  constructor(props: UsuarioMangaProps) {
    this.userId = props.userId
    this.mangaId = props.mangaId
    this.rating = props.rating
    this.readingStatus = props.readingStatus
    this.createdAt = new Date()
  }

  changeReadingStatus(readingStatus: MangaReadingStatus): void {
    this.readingStatus = readingStatus
  }

  setReadingStatus(readingStatus: MangaReadingStatus): void {
    this.readingStatus = readingStatus
    this.updatedAt = new Date()
  }
}
