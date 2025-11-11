import { Module } from '@nestjs/common'

import { DemographicManagementModule } from './demographic-management/demographic-management.module'
import { GenreManagementModule } from './genre-management/genre-management.module'
import { MangaManagementModule } from './manga-management/manga-management.module'
import { UploadModule } from './upload/upload.module'

@Module({
  imports: [
    MangaManagementModule,
    GenreManagementModule,
    DemographicManagementModule,
    UploadModule,
  ],
  providers: [],
  exports: [
    MangaManagementModule,
    GenreManagementModule,
    DemographicManagementModule,
    UploadModule,
  ],
})
export class AdminModule {}
