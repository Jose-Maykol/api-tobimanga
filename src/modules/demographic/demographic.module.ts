import { Module } from '@nestjs/common'
import { DemographicRepositoryImpl } from './infrastructure/repositories/demographic.repository.impl'
import { GetAllDemographicsUseCase } from './application/use-cases/get-all-demographics.use-case'
import { DatabaseModule } from '@/core/database/database.module'
import { DemographicController } from './interface/controllers/demographic.controller'
import { GetDemographicByIdUseCase } from './application/use-cases/get-demographic-by-id.use-case'

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
