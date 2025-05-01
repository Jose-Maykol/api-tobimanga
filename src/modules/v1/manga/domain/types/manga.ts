import AuthorRecord from './author'
import DemographicRecord from './demographic'
import GenreRecord from './genre'

type MangaRecord = {
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
  publicationStatus: string
  rating: number
  active: boolean
  authors: AuthorRecord[]
  genres: GenreRecord[]
  demographic: DemographicRecord
  createdAt: Date
  updatedAt: Date | null
}

export default MangaRecord
