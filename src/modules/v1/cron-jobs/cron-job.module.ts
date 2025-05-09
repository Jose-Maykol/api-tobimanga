import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { CronSchedulerService } from './application/services/cron-scheduler.service'
import { CronJobController } from './interface/controllers/cron-job.controller'
import { DatabaseModule } from '@/modules/database/database.module'
import { CronTaskRegistry } from './domain/cron-tasks.registry'
import { SyncAllMangasChaptersCommand } from '../manga/application/commands/sync-all-mangas-chapters.command'
import { CronJobRepositoryImpl } from './infraestructure/repositories/cron-job.repository.impl'
import { ScheduleModule } from '@nestjs/schedule'
import { CreateCronJobHandler } from './application/commands/create-cron-job/create-cron-job.handler'

const commandHandlers = [CreateCronJobHandler, SyncAllMangasChaptersCommand]

const queryHandlers = []

const readRepositories = []
const writeRepositories = [
  {
    provide: 'CronJobRepository',
    useClass: CronJobRepositoryImpl,
  },
]

const provideCronTaskRegistry = {
  provide: 'CRON_TASK_REGISTRY',
  useFactory: () => {
    CronTaskRegistry.registerCommand(
      'SyncAllMangasChaptersCommand',
      SyncAllMangasChaptersCommand,
    )
    return true
  },
}

@Module({
  imports: [CqrsModule, DatabaseModule, ScheduleModule.forRoot()],
  controllers: [CronJobController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...readRepositories,
    ...writeRepositories,
    CronSchedulerService,
    provideCronTaskRegistry,
  ],
})
export class CronJobModule {
  constructor() {}
}
