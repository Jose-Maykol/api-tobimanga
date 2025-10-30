import { Module } from '@nestjs/common'

import { ChapterRepositoryImpl } from './repositories/chapter.repository.impl'
import { MangaRepositoryImpl } from './repositories/manga.repository.impl'

@Module({
  providers: [
    {
      provide: 'MangaRepository',
      useClass: MangaRepositoryImpl,
    },
    {
      provide: 'ChapterRepository',
      useClass: ChapterRepositoryImpl,
    },
  ],
  exports: ['MangaRepository', 'ChapterRepository'],
})
export class InfrastructureModule {}
