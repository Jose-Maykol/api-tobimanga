import { Inject, Injectable } from '@nestjs/common'

import { CronJobExecutionStatus } from '../../domain/enums/cron-job-execution-status.enum'
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
      throw new Error(`Cron job execution con id ${executionId} no encontrado`)
    }

    if (execution.status !== CronJobExecutionStatus.RUNNING) {
      throw new Error(
        `La ejecución no está en estado RUNNING (estado actual: ${execution.status})`,
      )
    }

    await this.cronJobSchedulerService.stopJobExecution(executionId)
  }
}
