import { Injectable } from '@nestjs/common'
import { CronJob } from '../../domain/entities/cron-job.entity'
import { CronJobMapper } from '../mappers/cron-job.mapper'
import { cronJobs } from '@/modules/database/schemas/cron-job.schema'
import { eq } from 'drizzle-orm'
import { CronJobRepository } from '../../domain/repositories/cron-job.repository'
import { DrizzleService } from '@/modules/database/services/drizzle.service'

@Injectable()
export class CronJobRepositoryImpl implements CronJobRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async save(cronJob: CronJob): Promise<void> {
    const persistenceCronJob = CronJobMapper.toPersistence(cronJob)
    await this.drizzle.db
      .insert(cronJobs)
      .values(persistenceCronJob)
      .returning()
  }

  async findAllActive(): Promise<CronJob[]> {
    const allCronJobs = await this.drizzle.db
      .select()
      .from(cronJobs)
      .where(eq(cronJobs.isActive, true))
    if (allCronJobs.length === 0) return []
    return allCronJobs.map((cronJob) => CronJobMapper.toDomain(cronJob))
  }

  async findById(id: string): Promise<CronJob | null> {
    const cronJob = await this.drizzle.db
      .select()
      .from(cronJobs)
      .where(eq(cronJobs.id, id))
    if (cronJob.length === 0) return null
    return CronJobMapper.toDomain(cronJob[0])
  }
}
