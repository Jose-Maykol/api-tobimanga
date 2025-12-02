import { Inject, Injectable } from '@nestjs/common'

import { Upload, UploadStatus } from '@/core/domain/entities/upload.entity'
import { UploadRepository } from '@/core/domain/repositories/upload.repository'
import { IMAGE_STORAGE_SERVICE } from '@/core/storage/constants/storage.constants'
import { StorageService } from '@/core/storage/interfaces/storage.service'
import { UPLOAD_REPOSITORY } from '@/infrastructure/tokens/repositories'

@Injectable()
export class UploadFileUseCase {
  constructor(
    @Inject(IMAGE_STORAGE_SERVICE)
    private readonly imageStorageService: StorageService,
    @Inject(UPLOAD_REPOSITORY)
    private readonly uploadRepository: UploadRepository,
  ) {}

  /**
   * Uploads a file, persists its metadata, and returns its storage data.
   * @param params Object containing file and entityType
   * @returns Object with url, contentType, and objectKey
   */
  async execute(params: {
    file: Express.Multer.File
    entityType?: string
  }): Promise<{
    url: string
    contentType: string
    objectKey: string
    id: string
  }> {
    const { file, entityType } = params
    const uploadResult = await this.imageStorageService.uploadFromBuffer(
      file.buffer,
    )

    const upload: Upload = {
      id: crypto.randomUUID(),
      fileName: file.originalname,
      contentType: file.mimetype,
      url: uploadResult.url,
      status: UploadStatus.PENDING,
      objectKey: uploadResult.objectKey,
      entityType: entityType || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await this.uploadRepository.save(upload)

    return {
      id: upload.id,
      url: upload.url,
      contentType: upload.contentType,
      objectKey: upload.objectKey,
    }
  }
}
