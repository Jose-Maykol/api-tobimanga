import { Inject, Injectable } from '@nestjs/common'

import { CronJobDeactivatedException } from '../../domain/exceptions/cron-job-deactivated.exception'
import { CronJobNotFoundException } from '../../domain/exceptions/cron-job-not-found.exception'
import { CronJobRepository } from '../../domain/repositories/cron-job.repository'
import { CRON_JOB_REPOSITORY } from '../../domain/tokens'
import { CronJobSchedulerService } from '../../infrastructure/services/cron-job-scheduler.service'

@Injectable()
export class ExecuteCronJobUseCase {
  constructor(
    @Inject(CRON_JOB_REPOSITORY)
    private readonly cronJobRepository: CronJobRepository,
    private readonly cronJobSchedulerService: CronJobSchedulerService,
  ) {}

  async execute(id: string): Promise<{ executionId: string }> {
    const cronJob = await this.cronJobRepository.findById(id)

    if (!cronJob) {
      throw new CronJobNotFoundException(id)
    }

    if (!cronJob.isActive) {
      throw new CronJobDeactivatedException(cronJob.name)
    }

    const executionId = await this.cronJobSchedulerService.executeJobManually(
      cronJob.key,
    )

    return { executionId }
  }
}
