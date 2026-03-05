import { Inject, Injectable, Logger } from '@nestjs/common'

import { StatisticsRepository } from '../../domain/repositories/statistics.repository'
import { STATISTICS_REPOSITORY } from '../../domain/tokens'

@Injectable()
export class GetUserStatisticsUseCase {
  private readonly logger = new Logger(GetUserStatisticsUseCase.name)

  constructor(
    @Inject(STATISTICS_REPOSITORY)
    private readonly statisticsRepository: StatisticsRepository,
  ) {}

  async execute() {
    this.logger.log('Retrieving user statistics')

    const statistics = await this.statisticsRepository.getUserStatistics()

    this.logger.log('User statistics retrieved successfully')

    return statistics
  }
}
