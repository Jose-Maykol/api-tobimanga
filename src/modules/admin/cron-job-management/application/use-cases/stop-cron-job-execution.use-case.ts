import { Inject, Injectable } from '@nestjs/common'

import { CronJobExecutionStatus } from '../../domain/enums/cron-job-execution-status.enum'
import { CronJobExecutionNotFoundException } from '../../domain/exceptions/cron-job-execution-not-found.exception'
import { CronJobExecutionNotRunningException } from '../../domain/exceptions/cron-job-execution-not-running.exception'
import { CronJobExecutionRepository } from '../../domain/repositories/cron-job-execution.repository'
import { CRON_JOB_EXECUTION_REPOSITORY } from '../../domain/tokens'
import { CronJobSchedulerService } from '../../infrastructure/services/cron-job-scheduler.service'

@Injectable()
export class StopCronJobExecutionUseCase {
  constructor(
    @Inject(CRON_JOB_EXECUTION_REPOSITORY)
    private readonly executionRepository: CronJobExecutionRepository,
    private readonly cronJobSchedulerService: CronJobSchedulerService,
  ) {}

  async execute(executionId: string): Promise<void> {
    const execution = await this.executionRepository.findById(executionId)

    if (!execution) {
      throw new CronJobExecutionNotFoundException(executionId)
    }

    if (execution.status !== CronJobExecutionStatus.RUNNING) {
      throw new CronJobExecutionNotRunningException(execution.status)
    }

    await this.cronJobSchedulerService.stopJobExecution(executionId)
  }
}
