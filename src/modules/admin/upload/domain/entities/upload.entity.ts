export enum UploadStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

export interface Upload {
  id: string
  fileName: string
  contentType: string
  url: string
  status: UploadStatus
  objectKey: string
  entityType?: string | null
  usedAt?: Date | null
  createdAt: Date
  updatedAt?: Date | null
}
