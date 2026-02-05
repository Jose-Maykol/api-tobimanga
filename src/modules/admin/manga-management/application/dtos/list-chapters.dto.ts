export interface ListChaptersDto {
  mangaId: string
  page: number
  limit: number
  order: 'asc' | 'desc'
}
