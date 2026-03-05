import { Inject, Injectable, Logger } from '@nestjs/common'

import { StatisticsRepository } from '../../domain/repositories/statistics.repository'
import { STATISTICS_REPOSITORY } from '../../domain/tokens'

@Injectable()
export class GetEngagementStatisticsUseCase {
  private readonly logger = new Logger(GetEngagementStatisticsUseCase.name)

  constructor(
    @Inject(STATISTICS_REPOSITORY)
    private readonly statisticsRepository: StatisticsRepository,
  ) {}

  async execute() {
    this.logger.log('Retrieving engagement statistics')

    const statistics = await this.statisticsRepository.getEngagementStatistics()

    this.logger.log('Engagement statistics retrieved successfully')

    return statistics
  }
}
