import { Module } from '@nestjs/common'

import { MangaManagementModule } from './manga-management/manga-management.module'

@Module({
  imports: [MangaManagementModule],
  providers: [],
  exports: [MangaManagementModule],
})
export class AdminModule {}
