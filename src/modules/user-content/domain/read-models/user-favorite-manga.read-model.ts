import { ReadingStatus } from '../value-objects/reading-status.vo'

export interface UserFavoriteMangaReadModel {
  // IDs
  id: string // manga ID
  userMangaId: string // relación user-manga

  // Datos del manga (desnormalizados para performance)
  title: string
  coverUrl: string | null
  synopsis: string | null
  publicationStatus: string

  // Datos del usuario (contexto)
  readingStatus: ReadingStatus
  rating: number | null
  lastReadChapter: number | null

  // Metadata
  favoritedAt: Date
  updatedAt: Date | null
}
