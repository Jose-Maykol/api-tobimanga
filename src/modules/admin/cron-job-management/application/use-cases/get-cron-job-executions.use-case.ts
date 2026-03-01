import { Inject, Injectable, Logger } from '@nestjs/common'

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

  async execute(cronJobId: string, limit = 20): Promise<CronJobExecution[]> {
    const cronJob = await this.cronJobRepository.findById(cronJobId)
    if (!cronJob) {
      this.logger.warn(
        `Get executions failed, cron job with id "${cronJobId}" not found`,
      )
      throw new CronJobNotFoundException(cronJobId)
    }

    const executions = await this.executionRepository.findByCronJobId(
      cronJobId,
      limit,
    )

    this.logger.log(
      `Retrieved ${executions.length} execution(s) for cron job "${cronJob.key}"`,
    )

    return executions
  }
}
