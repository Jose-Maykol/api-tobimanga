import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse

export interface UploadOptions {
  folder?: string
}

export interface UploadResult {
  url: string
  objectKey: string
}

export interface StorageService {
  uploadFromBuffer(file: Buffer, options?: UploadOptions): Promise<UploadResult>
  uploadFromBase64(
    base64: string,
    options?: UploadOptions,
  ): Promise<UploadResult>
  delete(objectKey: string): Promise<void>
}
