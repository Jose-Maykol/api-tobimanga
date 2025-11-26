import { eq } from 'drizzle-orm'

import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { uploads } from '@/core/database/schemas/upload.schema'
import { DatabaseService } from '@/core/database/services/database.service'
import { Upload, UploadStatus } from '@/core/domain/entities/upload.entity'
import { UploadRepository } from '@/core/domain/repositories/upload.repository'

@Injectable()
export class UploadRepositoryImpl implements UploadRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  async save(upload: Upload): Promise<Upload> {
    await this.db.client.insert(uploads).values({
      id: upload.id,
      fileName: upload.fileName,
      contentType: upload.contentType,
      url: upload.url,
      status: upload.status,
      objectKey: upload.objectKey,
      entityType: upload.entityType,
      createdAt: upload.createdAt,
      updatedAt: upload.updatedAt,
    })
    return upload
  }

  async updateStatus(
    id: string,
    status: UploadStatus,
    usedAt?: Date,
  ): Promise<void> {
    const updateData: Record<string, unknown> = {
      status,
      updatedAt: new Date(),
    }
    if (status === UploadStatus.ACTIVE) {
      updateData.usedAt = usedAt ?? new Date()
    }
    await this.db.client
      .update(uploads)
      .set(updateData)
      .where(eq(uploads.id, id))
  }
}
