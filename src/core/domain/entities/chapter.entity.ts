export interface Chapter {
  id: string
  mangaId: string
  chapterNumber: number
  title: string | null
  releaseDate: Date | null
  createdAt: Date
  updatedAt: Date | null
}
