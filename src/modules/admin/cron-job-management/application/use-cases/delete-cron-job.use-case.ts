import { Inject, Injectable, Logger } from '@nestjs/common'

import { CronJobNotFoundException } from '../../domain/exceptions/cron-job-not-found.exception'
import { CronJobRepository } from '../../domain/repositories/cron-job.repository'
import { CRON_JOB_REPOSITORY } from '../../domain/tokens'
import { CronJobSchedulerService } from '../../infrastructure/services/cron-job-scheduler.service'

@Injectable()
export class DeleteCronJobUseCase {
  private readonly logger = new Logger(DeleteCronJobUseCase.name)

  constructor(
    @Inject(CRON_JOB_REPOSITORY)
    private readonly cronJobRepository: CronJobRepository,
    private readonly schedulerService: CronJobSchedulerService,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.cronJobRepository.findById(id)
    if (!existing) {
      this.logger.warn(`Delete failed, cron job with id "${id}" not found`)
      throw new CronJobNotFoundException(id)
    }

    this.schedulerService.removeCronJobIfExists(existing.key)
    await this.cronJobRepository.delete(id)

    this.logger.log(`Cron job "${existing.key}" deleted successfully`)
  }
}
