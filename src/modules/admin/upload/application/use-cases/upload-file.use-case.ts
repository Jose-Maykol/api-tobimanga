import { Inject, Injectable } from '@nestjs/common'

import { Upload } from '@/core/domain/entities/upload.entity'
import { UploadRepository } from '@/core/domain/repositories/upload.repository'
import { IMAGE_STORAGE_SERVICE } from '@/core/storage/constants/storage.constants'
import { StorageService } from '@/core/storage/interfaces/storage.service'

@Injectable()
export class UploadFileUseCase {
  constructor(
    @Inject(IMAGE_STORAGE_SERVICE)
    private readonly imageStorageService: StorageService,
    @Inject('UploadRepository')
    private readonly uploadRepository: UploadRepository,
  ) {}

  /**
   * Uploads a file, persists its metadata, and returns its storage data.
   * @param file File to upload
   * @returns Object with url, contentType, and objectKey
   */
  async execute(
    file: Express.Multer.File,
  ): Promise<{ url: string; contentType: string; objectKey: string }> {
    const uploadResult = await this.imageStorageService.uploadFromBuffer(
      file.buffer,
    )

    const upload: Upload = {
      id: crypto.randomUUID(),
      contentType: file.mimetype,
      url: uploadResult.url,
      status: 'USED',
      objectKey: uploadResult.objectKey,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await this.uploadRepository.save(upload)

    return {
      url: upload.url,
      contentType: upload.contentType,
      objectKey: upload.objectKey,
    }
  }
}
