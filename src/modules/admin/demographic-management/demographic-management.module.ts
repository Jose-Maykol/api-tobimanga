import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/core/database/database.module'
import { AuthModule } from '@/modules/auth/auth.module'

import { GetAllDemographicsUseCase } from './application/use-cases/get-all-demographics.use-case'
import { GetDemographicByIdUseCase } from './application/use-cases/get-demographic-by-id.use-case'
import { DEMOGRAPHIC_REPOSITORY } from './domain/tokens'
import { DemographicRepositoryImpl } from './infrastructure/repositories/demographic.repository.impl'
import { DemographicManagementController } from './interface/controllers/demographic-management.controller'

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [
    { provide: DEMOGRAPHIC_REPOSITORY, useClass: DemographicRepositoryImpl },
    GetDemographicByIdUseCase,
    GetAllDemographicsUseCase,
  ],
  controllers: [DemographicManagementController],
  exports: [GetDemographicByIdUseCase, GetAllDemographicsUseCase],
})
export class DemographicManagementModule { }
