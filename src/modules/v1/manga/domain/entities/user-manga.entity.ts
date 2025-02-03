import { MangaReadingStatus } from '../enums/manga-reading-status.enum'

type UserMangaProps = {
  id?: string
  userId: string
  mangaId: string
  rating?: number
  readingStatus: MangaReadingStatus
  createdAt?: Date
  updatedAt?: Date
}

export class UserManga {
  private userId: string
  private mangaId: string
  private rating?: number
  private readingStatus: MangaReadingStatus
  private createdAt: Date
  private updatedAt?: Date

  constructor(props: UserMangaProps) {
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

  getUserId(): string {
    return this.userId
  }

  getMangaId(): string {
    return this.mangaId
  }

  getRating(): number {
    if (!this.rating) {
      return 0
    }
    return this.rating
  }

  getReadingStatus(): MangaReadingStatus {
    return this.readingStatus
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date | null {
    if (!this.updatedAt) {
      return null
    }
    return this.updatedAt
  }
}
