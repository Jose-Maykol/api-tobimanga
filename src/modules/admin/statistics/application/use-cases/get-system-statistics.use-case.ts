import { Inject, Injectable, Logger } from '@nestjs/common'

import { StatisticsRepository } from '../../domain/repositories/statistics.repository'
import { STATISTICS_REPOSITORY } from '../../domain/tokens'

@Injectable()
export class GetSystemStatisticsUseCase {
  private readonly logger = new Logger(GetSystemStatisticsUseCase.name)

  constructor(
    @Inject(STATISTICS_REPOSITORY)
    private readonly statisticsRepository: StatisticsRepository,
  ) {}

  async execute() {
    this.logger.log('Retrieving system statistics')

    const statistics = await this.statisticsRepository.getSystemStatistics()

    this.logger.log('System statistics retrieved successfully')

    return statistics
  }
}
