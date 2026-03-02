import { Module } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'

import { DatabaseModule } from '@/core/database/database.module'
import { AuthModule } from '@/modules/auth/auth.module'

import { CreateCronJobUseCase } from './application/use-cases/create-cron-job.use-case'
import { DeleteCronJobUseCase } from './application/use-cases/delete-cron-job.use-case'
import { ExecuteCronJobUseCase } from './application/use-cases/execute-cron-job.use-case'
import { GetAllCronJobsUseCase } from './application/use-cases/get-all-cron-jobs.use-case'
import { GetCronJobByIdUseCase } from './application/use-cases/get-cron-job-by-id.use-case'
import { GetCronJobExecutionsUseCase } from './application/use-cases/get-cron-job-executions.use-case'
import { GetCronJobProcessesUseCase } from './application/use-cases/get-cron-job-processes.use-case'
import { StopCronJobExecutionUseCase } from './application/use-cases/stop-cron-job-execution.use-case'
import { ToggleCronJobUseCase } from './application/use-cases/toggle-cron-job.use-case'
import { UpdateCronJobUseCase } from './application/use-cases/update-cron-job.use-case'
import {
  CRON_JOB_EXECUTION_REPOSITORY,
  CRON_JOB_REPOSITORY,
} from './domain/tokens'
import { CronJobRepositoryImpl } from './infrastructure/repositories/cron-job.repository.impl'
import { CronJobExecutionRepositoryImpl } from './infrastructure/repositories/cron-job-execution.repository.impl'
import { CronJobSchedulerService } from './infrastructure/services/cron-job-scheduler.service'
import { CronJobManagementController } from './interface/controllers/cron-job-management.controller'

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ScheduleModule.forRoot(),
    DiscoveryModule,
  ],
  providers: [
    {
      provide: CRON_JOB_REPOSITORY,
      useClass: CronJobRepositoryImpl,
    },
    {
      provide: CRON_JOB_EXECUTION_REPOSITORY,
      useClass: CronJobExecutionRepositoryImpl,
    },
    CronJobSchedulerService,
    CreateCronJobUseCase,
    GetAllCronJobsUseCase,
    GetCronJobByIdUseCase,
    UpdateCronJobUseCase,
    DeleteCronJobUseCase,
    ToggleCronJobUseCase,
    GetCronJobExecutionsUseCase,
    GetCronJobProcessesUseCase,
    ExecuteCronJobUseCase,
    StopCronJobExecutionUseCase,
  ],
  controllers: [CronJobManagementController],
  exports: [CronJobSchedulerService],
})
export class CronJobManagementModule {}
