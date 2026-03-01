import { isValidCron } from 'cron-validator'

import { Inject, Injectable, Logger } from '@nestjs/common'

import { CronJob } from '../../domain/entities/cron-job.entity'
import { CronJobAlreadyExistsException } from '../../domain/exceptions/cron-job-already-exists.exception'
import { CronJobRepository } from '../../domain/repositories/cron-job.repository'
import { CRON_JOB_REPOSITORY } from '../../domain/tokens'
import { CronJobSchedulerService } from '../../infrastructure/services/cron-job-scheduler.service'
import { CreateCronJobDto } from '../dtos/create-cron-job.dto'

@Injectable()
export class CreateCronJobUseCase {
  private readonly logger = new Logger(CreateCronJobUseCase.name)

  constructor(
    @Inject(CRON_JOB_REPOSITORY)
    private readonly cronJobRepository: CronJobRepository,
    private readonly schedulerService: CronJobSchedulerService,
  ) {}

  async execute(params: CreateCronJobDto): Promise<CronJob> {
    const existing = await this.cronJobRepository.findByKey(params.key)
    if (existing) {
      this.logger.warn(
        `Creation failed, cron job with key "${params.key}" already exists`,
      )
      throw new CronJobAlreadyExistsException(params.key)
    }

    if (!isValidCron(params.schedule, { seconds: true })) {
      throw new Error(
        `La expresión cron "${params.schedule}" no es válida. Use el formato: segundo minuto hora día mes díaSemana`,
      )
    }

    const cronJob: CronJob = {
      id: crypto.randomUUID(),
      key: params.key,
      name: params.name,
      description: params.description || null,
      schedule: params.schedule,
      options: {},
      isActive: params.isActive ?? true,
      lastRunAt: null,
      nextRunAt: null,
      createdAt: new Date(),
      updatedAt: null,
    }

    const saved = await this.cronJobRepository.save(cronJob)

    if (saved.isActive) {
      this.schedulerService.registerCronJob(saved.key, saved.schedule)
    }

    this.logger.log(
      `Cron job created: "${saved.name}" (key: ${saved.key}, schedule: ${saved.schedule})`,
    )

    return saved
  }
}
