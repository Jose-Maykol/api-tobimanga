import { Inject, Injectable, Logger } from '@nestjs/common'

import { Upload, UploadStatus } from '../../domain/entities/upload.entity'
import { UploadRepository } from '../../domain/repositories/upload.repository'
import { IMAGE_STORAGE_SERVICE } from '@/core/storage/constants/storage.constants'
import { StorageService } from '@/core/storage/interfaces/storage.service'
import { UPLOAD_REPOSITORY } from '../../domain/tokens'

@Injectable()
export class UploadFileUseCase {
  private readonly logger = new Logger(UploadFileUseCase.name)

  constructor(
    @Inject(IMAGE_STORAGE_SERVICE)
    private readonly imageStorageService: StorageService,
    @Inject(UPLOAD_REPOSITORY)
    private readonly uploadRepository: UploadRepository,
  ) { }

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

    this.logger.log(
      `File uploaded successfully with name ${file.originalname} and ID ${upload.id} (${file.mimetype})`,
    )

    return {
      id: upload.id,
      url: upload.url,
      contentType: upload.contentType,
      objectKey: upload.objectKey,
    }
  }
}
