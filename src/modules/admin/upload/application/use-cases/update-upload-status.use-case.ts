import { Inject, Injectable } from '@nestjs/common'

import { Upload, UploadStatus } from '@/core/domain/entities/upload.entity'
import { UploadNotFoundException } from '@/core/domain/exceptions/upload/upload-not-found'
import { UploadRepository } from '@/core/domain/repositories/upload.repository'
import { UPLOAD_REPOSITORY } from '@/infrastructure/tokens/repositories'

export type UpdateUploadStatusParams = {
  id: string
  status: UploadStatus
  usedAt?: Date
}

@Injectable()
export class UpdateUploadStatusUseCase {
  constructor(
    @Inject(UPLOAD_REPOSITORY)
    private readonly uploadRepository: UploadRepository,
  ) {}

  async execute(params: UpdateUploadStatusParams): Promise<Upload> {
    if (params.status === UploadStatus.ACTIVE && !params.usedAt) {
      params.usedAt = new Date()
    }

    const upload = await this.uploadRepository.findById(params.id)

    if (upload === null) throw new UploadNotFoundException(params.id)

    const result = await this.uploadRepository.updateStatus(
      params.id,
      params.status,
      params.usedAt,
    )

    return result
  }
}
