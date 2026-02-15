import { PublicationStatus } from '@/modules/admin/manga-management/domain/value-objects/publication-status.vo'

import { ReadingStatus } from '../value-objects/reading-status.vo'

export interface UserMangaDetailReadModel {
  // Manga Fields
  id: string
  title: string
  slug: string
  synopsis: string
  coverUrl: string | null
  bannerUrl: string | null
  publicationStatus: PublicationStatus
  authors: { id: string; name: string }[]
  genres: { id: string; name: string }[]
  demographic: { id: string; name: string } | null

  // User Fields
  isFavorite: boolean
  readingStatus: ReadingStatus
  rating: number | null
  startedAt: Date | null
  finishedAt: Date | null
  updatedAt: Date | null
}
