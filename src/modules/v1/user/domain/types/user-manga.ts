import { MangaReadingStatus } from '../enums/manga-reading-status.enum'

type UserMangaRecord = {
  mangaId: string
  userId: string
  readingStatus: MangaReadingStatus
  rating: number | 0
  createdAt: Date
  updatedAt: Date | null
}

export default UserMangaRecord
