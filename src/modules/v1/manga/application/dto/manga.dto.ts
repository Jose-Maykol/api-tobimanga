import { AuthorDto } from './author.dto'
import { DemographicDto } from './demographic.dto'
import { GenreDto } from './genre.dto'

export type MangaDto = {
  id: string
  originalName: string
  alternativeNames: string[] | null
  slugName: string
  scrappingName: string
  sinopsis: string
  chapters: number
  releaseDate: Date
  coverImage: string
  bannerImage: string
  publicationStatus: PublicationStatus
  rating: number
  active: boolean
  authors: AuthorDto[]
  genres: GenreDto[]
  demographic: DemographicDto
  createdAt: Date
  updatedAt: Date | null
}

export type PublicationStatus =
  | 'ONGOING'
  | 'FINISHED'
  | 'HIATUS'
  | 'CANCELLED'
  | 'NOT_YET_RELEASED'
  | 'UNKNOWN'

export type PaginatedAdminMangaDto = {
  mangas: Pick<
    MangaDto,
    | 'id'
    | 'originalName'
    | 'chapters'
    | 'rating'
    | 'coverImage'
    | 'publicationStatus'
    | 'active'
    | 'updatedAt'
  >[]
  total: number
}
