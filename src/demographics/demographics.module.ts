import { Module } from '@nestjs/common'
import { DemographicsController } from './demographics.controller'
import { DemographicsService } from './demographics.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Demography } from '@/models/demography.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Demography])],
  controllers: [DemographicsController],
  providers: [DemographicsService],
})
export class DemographicsModule {}
