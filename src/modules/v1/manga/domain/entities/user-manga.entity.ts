export enum ReadingStatusEnum {
  READING = 'READING',
  COMPLETED = 'COMPLETED',
  DROPPED = 'DROPPED',
  PLANNING_TO_READ = 'PLANNING_TO_READ',
  PAUSED = 'PAUSED',
  UNKNOWN = 'UNKNOWN',
}
type UsuarioMangaProps = {
  id?: string
  userId: string
  mangaId: string
  rating?: number
  readingStatus: ReadingStatusEnum
  createdAt?: Date
  updatedAt?: Date
}

export class UsuarioManga {
  private userId: string
  private mangaId: string
  private rating?: number
  private readingStatus: ReadingStatusEnum
  private createdAt: Date
  private updatedAt?: Date

  constructor(props: UsuarioMangaProps) {
    this.userId = props.userId
    this.mangaId = props.mangaId
    this.rating = props.rating
    this.readingStatus = props.readingStatus
    this.createdAt = new Date()
  }

  changeReadingStatus(readingStatus: ReadingStatusEnum): void {
    this.readingStatus = readingStatus
  }

  setReadingStatus(readingStatus: ReadingStatusEnum): void {
    this.readingStatus = readingStatus
    this.updatedAt = new Date()
  }
}
