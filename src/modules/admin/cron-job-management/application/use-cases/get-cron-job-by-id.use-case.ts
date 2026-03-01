import { Inject, Injectable, Logger } from '@nestjs/common'

import { CronJob } from '../../domain/entities/cron-job.entity'
import { CronJobNotFoundException } from '../../domain/exceptions/cron-job-not-found.exception'
import { CronJobRepository } from '../../domain/repositories/cron-job.repository'
import { CRON_JOB_REPOSITORY } from '../../domain/tokens'

@Injectable()
export class GetCronJobByIdUseCase {
  private readonly logger = new Logger(GetCronJobByIdUseCase.name)

  constructor(
    @Inject(CRON_JOB_REPOSITORY)
    private readonly cronJobRepository: CronJobRepository,
  ) {}

  async execute(id: string): Promise<CronJob> {
    const cronJob = await this.cronJobRepository.findById(id)

    if (!cronJob) {
      this.logger.warn(`Cron job with id "${id}" not found`)
      throw new CronJobNotFoundException(id)
    }

    return cronJob
  }
}
