import { Module } from '@nestjs/common'

import { ListDemographicsUseCase } from './application/use-cases/list-demographics.use-case'
import { DemographicCatalogRepository } from './infrastructure/repositories/demographic-catalog.repository'
import { DemographicCatalogController } from './interface/controllers/demographic-catalog.controller'

@Module({
  controllers: [DemographicCatalogController],
  providers: [ListDemographicsUseCase, DemographicCatalogRepository],
  exports: [ListDemographicsUseCase],
})
export class DemographicCatalogModule {}
