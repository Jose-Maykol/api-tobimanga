import { ReadingStatus } from '../value-objects/reading-status.vo'

export interface UserManga {
  id: string
  userId: string
  mangaId: string
  rating: number | null
  readingStatus: ReadingStatus
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date | null
}
