import { Inject, Injectable } from '@nestjs/common'

import { Upload } from '@/core/domain/entities/upload.entity'
import { UploadNotFoundException } from '@/core/domain/exceptions/upload/upload-not-found'
import { UploadRepository } from '@/core/domain/repositories/upload.repository'
import { UPLOAD_REPOSITORY } from '@/infrastructure/tokens/repositories'

@Injectable()
export class FindUploadByUrlUseCase {
  constructor(
    @Inject(UPLOAD_REPOSITORY)
    private readonly uploadRepository: UploadRepository,
  ) {}

  /**
   * Find an upload by its URL.
   * @param params Object containing the URL to search for.
   * @returns The found Upload entity.
   * @throws UploadNotFoundException if no upload is found for the given URL.
   */
  async execute({ url }: { url: string }): Promise<Upload> {
    const upload = await this.uploadRepository.findByUrl(url)

    if (upload === null) throw new UploadNotFoundException()

    return upload
  }
}
