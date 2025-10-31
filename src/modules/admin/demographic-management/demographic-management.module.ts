import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/core/database/database.module'
import { InfrastructureModule } from '@/infrastructure/infraestructure.module'
import { AuthModule } from '@/modules/auth/auth.module'

import { GetAllDemographicsUseCase } from './application/use-cases/get-all-demographics.use-case'
import { GetDemographicByIdUseCase } from './application/use-cases/get-demographic-by-id.use-case'
import { DemographicManagementController } from './interface/controllers/demographic-management.controller'

@Module({
  imports: [InfrastructureModule, DatabaseModule, AuthModule],
  providers: [GetDemographicByIdUseCase, GetAllDemographicsUseCase],
  controllers: [DemographicManagementController],
  exports: [GetDemographicByIdUseCase, GetAllDemographicsUseCase],
})
export class DemographicManagementModule {}
