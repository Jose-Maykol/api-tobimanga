import { Upload } from '../entities/upload.entity'

export interface UploadRepository {
  save(upload: Upload): Promise<Upload>
}
