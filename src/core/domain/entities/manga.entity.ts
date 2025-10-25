import { Demographic } from '@/core/domain/entities/demographic.entity'
import { PublicationStatus } from '../../../modules/manga/application/enums/publication-status.enum'
import { Genre } from '@/core/domain/entities/genre.entity'
import { Author } from '@/core/domain/entities/author.entity'

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
