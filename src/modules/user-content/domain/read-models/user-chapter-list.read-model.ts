
export class UserChapterListReadModel {
  id: string
  chapterNumber: number
  title: string | null
  releaseDate: Date | null
  isRead: boolean
  readAt: Date | null
}
