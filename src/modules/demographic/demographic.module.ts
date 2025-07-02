import { Module } from '@nestjs/common'
import { DemographicRepositoryImpl } from './infrastructure/repositories/demographic.repository.impl'
import { GetDemographicsUseCase } from './application/use-cases/get-demographics.use-case'
import { DatabaseModule } from '@/core/database/database.module'
import { DemographicController } from './interface/controllers/demographic.controller'

const useCases = [GetDemographicsUseCase]

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
  exports: [],
})
export class DemographicModule {}
