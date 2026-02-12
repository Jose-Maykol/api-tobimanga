import { Inject, Injectable, Logger } from '@nestjs/common'

import { UploadNotFoundException } from '@/modules/admin/upload/domain/exceptions/upload-not-found.exception'

import { Upload } from '../../domain/entities/upload.entity'
import { UploadRepository } from '../../domain/repositories/upload.repository'
import { UPLOAD_REPOSITORY } from '../../infrastructure/tokens'

@Injectable()
export class FindUploadByUrlUseCase {
  private readonly logger = new Logger(FindUploadByUrlUseCase.name)

  constructor(
    @Inject(UPLOAD_REPOSITORY)
    private readonly uploadRepository: UploadRepository,
  ) {}

  //TODO: Se tiene que redisenar esta funcion, deberia buscar por id y no por url
  async execute({ url }: { url: string }): Promise<Upload> {
    const upload = await this.uploadRepository.findByUrl(url)

    if (upload === null) {
      this.logger.warn(`Upload not found with URL ${url}`)
      throw new UploadNotFoundException(url)
    }

    return upload
  }
}
