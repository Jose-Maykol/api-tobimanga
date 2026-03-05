import { Inject, Injectable, Logger } from '@nestjs/common'

import { StatisticsRepository } from '../../domain/repositories/statistics.repository'
import { STATISTICS_REPOSITORY } from '../../domain/tokens'

@Injectable()
export class GetCatalogStatisticsUseCase {
  private readonly logger = new Logger(GetCatalogStatisticsUseCase.name)

  constructor(
    @Inject(STATISTICS_REPOSITORY)
    private readonly statisticsRepository: StatisticsRepository,
  ) {}

  async execute() {
    this.logger.log('Retrieving catalog statistics')

    const statistics = await this.statisticsRepository.getCatalogStatistics()

    this.logger.log('Catalog statistics retrieved successfully')

    return statistics
  }
}
