import { Inject, Injectable, Logger } from '@nestjs/common'

import { Pagination } from '@/common/interfaces/pagination.interface'
import { calculatePagination } from '@/common/utils/pagination.util'

import { CronJobExecution } from '../../domain/entities/cron-job-execution.entity'
import { CronJobNotFoundException } from '../../domain/exceptions/cron-job-not-found.exception'
import { CronJobRepository } from '../../domain/repositories/cron-job.repository'
import { CronJobExecutionRepository } from '../../domain/repositories/cron-job-execution.repository'
import {
  CRON_JOB_EXECUTION_REPOSITORY,
  CRON_JOB_REPOSITORY,
} from '../../domain/tokens'

@Injectable()
export class GetCronJobExecutionsUseCase {
  private readonly logger = new Logger(GetCronJobExecutionsUseCase.name)

  constructor(
    @Inject(CRON_JOB_REPOSITORY)
    private readonly cronJobRepository: CronJobRepository,
    @Inject(CRON_JOB_EXECUTION_REPOSITORY)
    private readonly executionRepository: CronJobExecutionRepository,
  ) {}

  async execute(
    cronJobId: string,
    page = 1,
    limit = 20,
  ): Promise<{
    executions: CronJobExecution[]
    meta: Pagination
  }> {
    const cronJob = await this.cronJobRepository.findById(cronJobId)
    if (!cronJob) {
      this.logger.warn(
        `Get executions failed, cron job with id "${cronJobId}" not found`,
      )
      throw new CronJobNotFoundException(cronJobId)
    }

    const [executions, total] = await Promise.all([
      this.executionRepository.findByCronJobId(cronJobId, page, limit),
      this.executionRepository.countByCronJobId(cronJobId),
    ])

    const pagination = calculatePagination(total, page, limit)

    this.logger.log(
      `Retrieved ${executions.length} execution(s) for cron job "${cronJob.key}" (Total: ${total})`,
    )

    return {
      executions,
      meta: pagination,
    }
  }
}
