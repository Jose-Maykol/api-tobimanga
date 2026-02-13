import { ReadingStatus } from '../types/reading-status.type'

export interface UserManga {
  id: string
  mangaId: string
  rating: number | null
  readingStatus: ReadingStatus
  createdAt: Date
  updatedAt: Date | null
}
