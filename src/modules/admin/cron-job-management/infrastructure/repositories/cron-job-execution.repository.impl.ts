import { desc, eq } from 'drizzle-orm'

import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { cronJobExecutions } from '@/core/database/schemas/cron-job-execution.schema'
import { DatabaseService } from '@/core/database/services/database.service'

import { CronJobExecution } from '../../domain/entities/cron-job-execution.entity'
import { CronJobExecutionRepository } from '../../domain/repositories/cron-job-execution.repository'

@Injectable()
export class CronJobExecutionRepositoryImpl
  implements CronJobExecutionRepository
{
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  async findByCronJobId(
    cronJobId: string,
    limit = 20,
  ): Promise<CronJobExecution[]> {
    const result = await this.db.client
      .select()
      .from(cronJobExecutions)
      .where(eq(cronJobExecutions.cronJobId, cronJobId))
      .orderBy(desc(cronJobExecutions.startedAt))
      .limit(limit)

    return result as CronJobExecution[]
  }

  async save(execution: CronJobExecution): Promise<CronJobExecution> {
    const result = await this.db.client
      .insert(cronJobExecutions)
      .values(execution)
      .returning()

    return result[0] as CronJobExecution
  }

  async update(
    id: string,
    execution: Partial<CronJobExecution>,
  ): Promise<CronJobExecution | null> {
    const result = await this.db.client
      .update(cronJobExecutions)
      .set(execution)
      .where(eq(cronJobExecutions.id, id))
      .returning()

    return result[0] ? (result[0] as CronJobExecution) : null
  }
}
