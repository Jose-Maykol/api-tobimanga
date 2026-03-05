import { Inject, Injectable, Logger } from '@nestjs/common'

import { StatisticsRepository } from '../../domain/repositories/statistics.repository'
import { STATISTICS_REPOSITORY } from '../../domain/tokens'

@Injectable()
export class GetUploadStatisticsUseCase {
  private readonly logger = new Logger(GetUploadStatisticsUseCase.name)

  constructor(
    @Inject(STATISTICS_REPOSITORY)
    private readonly statisticsRepository: StatisticsRepository,
  ) {}

  async execute() {
    this.logger.log('Retrieving upload statistics')

    const statistics = await this.statisticsRepository.getUploadStatistics()

    this.logger.log('Upload statistics retrieved successfully')

    return statistics
  }
}
