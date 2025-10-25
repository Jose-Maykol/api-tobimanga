import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/core/database/database.module'

import { GetAllDemographicsUseCase } from './application/use-cases/get-all-demographics.use-case'
import { GetDemographicByIdUseCase } from './application/use-cases/get-demographic-by-id.use-case'
import { DemographicRepositoryImpl } from './infrastructure/repositories/demographic.repository.impl'
import { DemographicController } from './interface/controllers/demographic.controller'

const useCases = [GetAllDemographicsUseCase, GetDemographicByIdUseCase]

const repositories = [
  {
    provide: 'DemographicRepository',
    useClass: DemographicRepositoryImpl,
  },
]

@Module({
  imports: [DatabaseModule],
  controllers: [DemographicController],
  providers: [...repositories, ...useCases],
  exports: [GetDemographicByIdUseCase, GetDemographicByIdUseCase],
})
export class DemographicModule {}
