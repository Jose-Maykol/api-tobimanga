import { Author } from '@/modules/admin/author-management/domain/entities/author.entity'
import { Demographic } from '@/modules/admin/demographic-management/domain/entities/demographic.entity'
import { Genre } from '@/modules/admin/genre-management/domain/entities/genre.entity'

import { PublicationStatus } from '../value-objects/publication-status.vo'

export interface Manga {
  id: string
  originalName: string
  slugName: string
  scrappingName: string
  alternativeNames: string[] | null
  sinopsis: string
  chapters: number
  releaseDate: Date
  coverImage: string
  bannerImage: string
  publicationStatus: PublicationStatus
  rating: number
  active: boolean
  authors: Author[]
  genres: Genre[]
  demographic: Demographic
  createdAt: Date
  updatedAt: Date | null
}
