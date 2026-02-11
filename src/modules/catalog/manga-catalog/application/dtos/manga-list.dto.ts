export interface MangaListItemDto {
  id: string
  originalName: string
  chapters: number
  releaseDate: Date
  coverImage: string
  rating: number
  genres: { id: string; name: string }[]
  demographic: { id: string; name: string }
}

export interface MangaDetailDto {
  id: string
  originalName: string
  slugName: string
  sinopsis: string
  chapters: number
  releaseDate: Date
  bannerImage: string
  rating: number
  publicationStatus: string
  authors: { id: string; name: string }[]
  genres: { id: string; name: string }[]
  demographic: { id: string; name: string }
}

export interface ListPublicMangasDto {
  page: number
  limit: number
  genreId?: string
  authorId?: string
  rating?: number
  search?: string
}
