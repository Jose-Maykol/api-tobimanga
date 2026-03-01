import { Inject, Injectable, Logger } from '@nestjs/common'

import { CronJob } from '../../domain/entities/cron-job.entity'
import { CronJobNotFoundException } from '../../domain/exceptions/cron-job-not-found.exception'
import { CronJobRepository } from '../../domain/repositories/cron-job.repository'
import { CRON_JOB_REPOSITORY } from '../../domain/tokens'
import { CronJobSchedulerService } from '../../infrastructure/services/cron-job-scheduler.service'

@Injectable()
export class ToggleCronJobUseCase {
  private readonly logger = new Logger(ToggleCronJobUseCase.name)

  constructor(
    @Inject(CRON_JOB_REPOSITORY)
    private readonly cronJobRepository: CronJobRepository,
    private readonly schedulerService: CronJobSchedulerService,
  ) {}

  async execute(id: string): Promise<CronJob> {
    const existing = await this.cronJobRepository.findById(id)
    if (!existing) {
      this.logger.warn(`Toggle failed, cron job with id "${id}" not found`)
      throw new CronJobNotFoundException(id)
    }

    const newActiveState = !existing.isActive
    const updated = await this.cronJobRepository.update(id, {
      isActive: newActiveState,
    })

    if (!updated) {
      throw new CronJobNotFoundException(id)
    }

    if (newActiveState) {
      this.schedulerService.registerCronJob(updated.key, updated.schedule)
      this.logger.log(`Cron job "${updated.key}" activated`)
    } else {
      this.schedulerService.removeCronJobIfExists(updated.key)
      this.logger.log(`Cron job "${updated.key}" deactivated`)
    }

    return updated
  }
}
