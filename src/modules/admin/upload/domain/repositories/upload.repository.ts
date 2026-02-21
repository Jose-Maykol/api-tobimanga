import { Upload, UploadStatus } from '../entities/upload.entity'

export interface UploadRepository {
  save(upload: Upload): Promise<Upload>
  updateStatus(id: string, status: UploadStatus, usedAt?: Date): Promise<Upload>
  findByUrl(url: string): Promise<Upload | null>
  findById(id: string): Promise<Upload | null>
  findAll(params: {
    page: number
    limit: number
    orderBy?: 'asc' | 'desc'
    status?: UploadStatus
  }): Promise<Upload[]>
  countAll(params?: { status?: UploadStatus }): Promise<number>
}
