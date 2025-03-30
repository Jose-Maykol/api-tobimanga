type UserChapterRecord = {
  userId: string
  chapterId: string
  read: boolean
  readAt: Date
  createdAt: Date
  updatedAt: Date | null
}

export default UserChapterRecord
