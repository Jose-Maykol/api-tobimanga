import { cronJobs } from '@/modules/database/schemas/cron-job.schema'
import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { Injectable } from '@nestjs/common'
import { CronJobListDto } from '../../../application/dtos/cron-job.dto'

@Injectable()
export class CronJobReadRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll(): Promise<CronJobListDto[]> {
    const allCronJobs = await this.drizzle.db
      .select({
        id: cronJobs.id,
        name: cronJobs.name,
        schedule: cronJobs.schedule,
        task: cronJobs.task,
        isActive: cronJobs.isActive,
      })
      .from(cronJobs)

    return allCronJobs
  }
}
