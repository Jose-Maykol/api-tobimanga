import { Upload, UploadStatus } from '../entities/upload.entity'

export interface UploadRepository {
  save(upload: Upload): Promise<Upload>
  updateStatus(id: string, status: UploadStatus, usedAt?: Date): Promise<void>
  findByUrl(url: string): Promise<Upload | null>
}
