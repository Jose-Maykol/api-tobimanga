export interface Upload {
  id: string
  contentType: string
  url: string
  status: 'USED' | 'TEMPORARY'
  objectKey: string
  createdAt: Date
  updatedAt?: Date | null
}
