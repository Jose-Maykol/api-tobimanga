import { Module } from '@nestjs/common'

import { CronJobManagementModule } from './cron-job-management/cron-job-management.module'
import { DemographicManagementModule } from './demographic-management/demographic-management.module'
import { GenreManagementModule } from './genre-management/genre-management.module'
import { MangaManagementModule } from './manga-management/manga-management.module'
import { StatisticsModule } from './statistics/statistics.module'
import { UploadModule } from './upload/upload.module'
import { UserManagementModule } from './user-management/user-management.module'

@Module({
  imports: [
    MangaManagementModule,
    GenreManagementModule,
    DemographicManagementModule,
    UploadModule,
    CronJobManagementModule,
    UserManagementModule,
    StatisticsModule,
  ],
  providers: [],
  exports: [
    MangaManagementModule,
    GenreManagementModule,
    DemographicManagementModule,
    UploadModule,
    CronJobManagementModule,
    UserManagementModule,
    StatisticsModule,
  ],
})
export class AdminModule {}
