import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/core/database/database.module'

import { AuthModule } from '../../auth/auth.module'
import { GetCatalogStatisticsUseCase } from './application/use-cases/get-catalog-statistics.use-case'
import { GetEngagementStatisticsUseCase } from './application/use-cases/get-engagement-statistics.use-case'
import { GetSystemStatisticsUseCase } from './application/use-cases/get-system-statistics.use-case'
import { GetUploadStatisticsUseCase } from './application/use-cases/get-upload-statistics.use-case'
import { GetUserStatisticsUseCase } from './application/use-cases/get-user-statistics.use-case'
import { STATISTICS_REPOSITORY } from './domain/tokens'
import { StatisticsRepositoryImpl } from './infrastructure/repositories/statistics.repository.impl'
import { StatisticsController } from './interface/controllers/statistics.controller'

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [StatisticsController],
  providers: [
    {
      provide: STATISTICS_REPOSITORY,
      useClass: StatisticsRepositoryImpl,
    },
    GetCatalogStatisticsUseCase,
    GetUserStatisticsUseCase,
    GetEngagementStatisticsUseCase,
    GetUploadStatisticsUseCase,
    GetSystemStatisticsUseCase,
  ],
})
export class StatisticsModule {}
