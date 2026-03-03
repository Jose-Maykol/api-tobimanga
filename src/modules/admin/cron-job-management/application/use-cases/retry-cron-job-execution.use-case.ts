import { Inject, Injectable } from '@nestjs/common'

import { CronJobExecutionNotFoundException } from '../../domain/exceptions/cron-job-execution-not-found.exception'
import { CronJobExecutionRepository } from '../../domain/repositories/cron-job-execution.repository'
import { CRON_JOB_EXECUTION_REPOSITORY } from '../../domain/tokens'
import { ExecuteCronJobUseCase } from './execute-cron-job.use-case'

@Injectable()
export class RetryCronJobExecutionUseCase {
  constructor(
    @Inject(CRON_JOB_EXECUTION_REPOSITORY)
    private readonly executionRepository: CronJobExecutionRepository,
    private readonly executeCronJobUseCase: ExecuteCronJobUseCase,
  ) {}

  async execute(executionId: string): Promise<{ executionId: string }> {
    const execution = await this.executionRepository.findById(executionId)

    if (!execution) {
      throw new CronJobExecutionNotFoundException(executionId)
    }

    return this.executeCronJobUseCase.execute(execution.cronJobId)
  }
}
