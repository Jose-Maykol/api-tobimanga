export interface MangaManagementListItemDto {
  id: string
  name: string
  slugName: string
  chapters: number
  rating: number
  publicationStatus: string
  coverImage: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}
