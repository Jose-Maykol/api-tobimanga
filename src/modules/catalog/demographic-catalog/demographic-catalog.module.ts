import { Module } from '@nestjs/common'

import { ListDemographicsUseCase } from './application/use-cases/list-demographics.use-case'
import { DemographicCatalogRepositoryImpl } from './infrastructure/repositories/demographic-catalog.repository.impl'
import { DEMOGRAPHIC_CATALOG_REPOSITORY } from './infrastructure/tokens'
import { DemographicCatalogController } from './interface/controllers/demographic-catalog.controller'

@Module({
  controllers: [DemographicCatalogController],
  providers: [
    ListDemographicsUseCase,
    {
      provide: DEMOGRAPHIC_CATALOG_REPOSITORY,
      useClass: DemographicCatalogRepositoryImpl,
    },
  ],
  exports: [ListDemographicsUseCase],
})
export class DemographicCatalogModule {}
