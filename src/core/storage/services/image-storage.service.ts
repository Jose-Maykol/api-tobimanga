import { Injectable } from '@nestjs/common'
import {
  StorageService,
  UploadOptions,
  UploadResult,
} from '../interfaces/storage.service'
import { v2 as cloudinary } from 'cloudinary'
import sharp from 'sharp'
import { fileTypeFromBuffer } from 'file-type'
import * as streamifier from 'streamifier'
import { InvalidImageException } from '../exceptions/invalid-image.exception'

@Injectable()
export class ImageStorageService implements StorageService {
  private async convertToWebp(buffer: Buffer): Promise<Buffer> {
    return await sharp(buffer).webp().toBuffer()
  }

  private async validateImage(buffer: Buffer): Promise<void> {
    const fileType = await fileTypeFromBuffer(buffer)
    if (!fileType || !fileType.mime.startsWith('image/')) {
      throw new InvalidImageException()
    }
  }

  private async uploadToCloudinary(
    buffer: Buffer,
    options?: UploadOptions,
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: options?.folder || 'images' },
        (err, result) => {
          if (err) return reject(err)
          if (!result)
            return reject(new Error('Upload failed: No result returned'))
          resolve({ url: result.secure_url, objectKey: result.public_id })
        },
      )
      streamifier.createReadStream(buffer).pipe(stream)
    })
  }

  async uploadFromBuffer(
    file: Buffer,
    options?: UploadOptions,
  ): Promise<UploadResult> {
    await this.validateImage(file)
    const webpBuffer = await this.convertToWebp(file)
    return await this.uploadToCloudinary(webpBuffer, options)
  }

  async uploadFromBase64(
    base64: string,
    options: UploadOptions,
  ): Promise<UploadResult> {
    const data = base64.replace(/^data:[^;]+;base64,/, '')
    const buffer = Buffer.from(data, 'base64')
    return await this.uploadFromBuffer(buffer, options)
  }

  async delete(objectKey: string): Promise<void> {
    await cloudinary.uploader.destroy(objectKey)
  }
}
