import { desc, eq } from 'drizzle-orm'

import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { cronJobs } from '@/core/database/schemas/cron-job.schema'
import { DatabaseService } from '@/core/database/services/database.service'

import { CronJob } from '../../domain/entities/cron-job.entity'
import { CronJobKey } from '../../domain/enums/cron-job-key.enum'
import { CronJobRepository } from '../../domain/repositories/cron-job.repository'

@Injectable()
export class CronJobRepositoryImpl implements CronJobRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  async findAll(): Promise<CronJob[]> {
    const result = await this.db.client
      .select()
      .from(cronJobs)
      .orderBy(desc(cronJobs.createdAt))

    return result as CronJob[]
  }

  async findById(id: string): Promise<CronJob | null> {
    const result = await this.db.client
      .select()
      .from(cronJobs)
      .where(eq(cronJobs.id, id))
      .limit(1)

    return result[0] ? (result[0] as CronJob) : null
  }

  async findByKey(key: CronJobKey): Promise<CronJob | null> {
    const result = await this.db.client
      .select()
      .from(cronJobs)
      .where(eq(cronJobs.key, key))
      .limit(1)

    return result[0] ? (result[0] as CronJob) : null
  }

  async findAllActive(): Promise<CronJob[]> {
    const result = await this.db.client
      .select()
      .from(cronJobs)
      .where(eq(cronJobs.isActive, true))

    return result as CronJob[]
  }

  async save(cronJob: CronJob): Promise<CronJob> {
    const result = await this.db.client
      .insert(cronJobs)
      .values(cronJob)
      .returning()

    return result[0] as CronJob
  }

  async update(id: string, cronJob: Partial<CronJob>): Promise<CronJob | null> {
    const result = await this.db.client
      .update(cronJobs)
      .set(cronJob)
      .where(eq(cronJobs.id, id))
      .returning()

    return result[0] ? (result[0] as CronJob) : null
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.client
      .delete(cronJobs)
      .where(eq(cronJobs.id, id))
      .returning()

    return result.length > 0
  }
}
