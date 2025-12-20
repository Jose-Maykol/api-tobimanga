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
  ): Promise<Upload> {
    const updateData: Record<string, unknown> = {
      status,
      updatedAt: new Date(),
    }

    if (status === UploadStatus.ACTIVE) {
      updateData.usedAt = usedAt ?? new Date()
    }

    const result = await this.db.client
      .update(uploads)
      .set(updateData)
      .where(eq(uploads.id, id))

    return result[0]
  }

  async findByUrl(url: string): Promise<Upload | null> {
    const result = await this.db.client
      .select()
      .from(uploads)
      .where(eq(uploads.url, url))
      .limit(1)

    if (result.length === 0) return null

    const row = result[0]
    return {
      id: row.id,
      fileName: row.fileName,
      contentType: row.contentType,
      url: row.url,
      status: row.status as UploadStatus,
      objectKey: row.objectKey,
      entityType: row.entityType,
      usedAt: row.usedAt ?? null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt ?? null,
    }
  }

  async findById(id: string): Promise<Upload | null> {
    const result = await this.db.client
      .select()
      .from(uploads)
      .where(eq(uploads.id, id))
      .limit(1)

    if (result.length === 0) return null

    const row = result[0]
    return {
      id: row.id,
      fileName: row.fileName,
      contentType: row.contentType,
      url: row.url,
      status: row.status as UploadStatus,
      objectKey: row.objectKey,
      entityType: row.entityType,
      usedAt: row.usedAt ?? null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt ?? null,
    }
  }
}
