import { Demographic } from '@/modules/demographic/domain/entities/demographic.entity'
import { PublicationStatus } from '../../application/enums/publication-status.enum'
import { Genre } from '@/modules/genres/domain/entities/genre.entity'
import { Author } from '@/modules/author/domain/entities/author.entity'

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
