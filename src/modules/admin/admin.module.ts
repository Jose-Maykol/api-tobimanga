import { Module } from '@nestjs/common'

import { DemographicManagementModule } from './demographic-management/demographic-management.module'
import { GenreManagementModule } from './genre-management/genre-management.module'
import { MangaManagementModule } from './manga-management/manga-management.module'

@Module({
  imports: [
    MangaManagementModule,
    GenreManagementModule,
    DemographicManagementModule,
  ],
  providers: [],
  exports: [
    MangaManagementModule,
    GenreManagementModule,
    DemographicManagementModule,
  ],
})
export class AdminModule {}
