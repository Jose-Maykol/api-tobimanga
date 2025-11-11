import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { uploads } from '@/core/database/schemas/upload.schema'
import { DatabaseService } from '@/core/database/services/database.service'
import { Upload } from '@/core/domain/entities/upload.entity'
import { UploadRepository } from '@/core/domain/repositories/upload.repository'

@Injectable()
export class UploadRepositoryImpl implements UploadRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  /**
   * Persist a new Upload entity.
   * @param upload Upload entity to persist
   * @returns Promise<Upload>
   */
  async save(upload: Upload): Promise<Upload> {
    await this.db.client.insert(uploads).values({
      id: upload.id,
      contentType: upload.contentType,
      url: upload.url,
      status: upload.status,
      objectKey: upload.objectKey,
      createdAt: upload.createdAt,
      updatedAt: upload.updatedAt,
    })
    return upload
  }
}
