import { Inject, Injectable, Logger } from '@nestjs/common'

import { CronJob } from '../../domain/entities/cron-job.entity'
import { CronJobRepository } from '../../domain/repositories/cron-job.repository'
import { CRON_JOB_REPOSITORY } from '../../domain/tokens'

@Injectable()
export class GetAllCronJobsUseCase {
  private readonly logger = new Logger(GetAllCronJobsUseCase.name)

  constructor(
    @Inject(CRON_JOB_REPOSITORY)
    private readonly cronJobRepository: CronJobRepository,
  ) {}

  async execute(): Promise<CronJob[]> {
    const cronJobs = await this.cronJobRepository.findAll()
    this.logger.log(`Retrieved ${cronJobs.length} cron job(s)`)
    return cronJobs
  }
}
