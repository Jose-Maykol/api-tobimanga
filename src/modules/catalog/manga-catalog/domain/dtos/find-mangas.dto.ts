export interface FindMangasDto {
  page: number
  limit: number
  genreId?: string
  authorId?: string
  rating?: number
  search?: string
}
