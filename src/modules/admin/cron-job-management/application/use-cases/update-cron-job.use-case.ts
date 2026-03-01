import { isValidCron } from 'cron-validator'

import { Inject, Injectable, Logger } from '@nestjs/common'

import { CronJob } from '../../domain/entities/cron-job.entity'
import { CronJobNotFoundException } from '../../domain/exceptions/cron-job-not-found.exception'
import { CronJobRepository } from '../../domain/repositories/cron-job.repository'
import { CRON_JOB_REPOSITORY } from '../../domain/tokens'
import { CronJobSchedulerService } from '../../infrastructure/services/cron-job-scheduler.service'
import { UpdateCronJobDto } from '../dtos/update-cron-job.dto'

@Injectable()
export class UpdateCronJobUseCase {
  private readonly logger = new Logger(UpdateCronJobUseCase.name)

  constructor(
    @Inject(CRON_JOB_REPOSITORY)
    private readonly cronJobRepository: CronJobRepository,
    private readonly schedulerService: CronJobSchedulerService,
  ) {}

  async execute(id: string, params: UpdateCronJobDto): Promise<CronJob> {
    const existing = await this.cronJobRepository.findById(id)
    if (!existing) {
      this.logger.warn(`Update failed, cron job with id "${id}" not found`)
      throw new CronJobNotFoundException(id)
    }

    if (params.schedule && !isValidCron(params.schedule, { seconds: true })) {
      throw new Error(
        `La expresión cron "${params.schedule}" no es válida. Use el formato: segundo minuto hora día mes díaSemana`,
      )
    }

    const updated = await this.cronJobRepository.update(id, {
      name: params.name ?? existing.name,
      description:
        params.description !== undefined
          ? params.description
          : existing.description,
      schedule: params.schedule ?? existing.schedule,
      isActive: params.isActive ?? existing.isActive,
    })

    if (!updated) {
      throw new CronJobNotFoundException(id)
    }

    // Re-register or remove the job from the scheduler
    if (updated.isActive) {
      this.schedulerService.registerCronJob(updated.key, updated.schedule)
    } else {
      this.schedulerService.removeCronJobIfExists(updated.key)
    }

    this.logger.log(`Cron job "${updated.key}" updated successfully`)
    return updated
  }
}
