import { Module } from '@nestjs/common'

import { ChapterRepositoryImpl } from './repositories/chapter.repository.impl'
import { DemographicRepositoryImpl } from './repositories/demographic.repository.impl'
import { GenreRepositoryImpl } from './repositories/genre.repository.impl'
import { MangaRepositoryImpl } from './repositories/manga.repository.impl'
import {
  CHAPTER_REPOSITORY,
  DEMOGRAPHIC_REPOSITORY,
  GENRE_REPOSITORY,
  MANGA_REPOSITORY,
} from './tokens/repositories'

@Module({
  providers: [
    {
      provide: MANGA_REPOSITORY,
      useClass: MangaRepositoryImpl,
    },
    {
      provide: CHAPTER_REPOSITORY,
      useClass: ChapterRepositoryImpl,
    },
    {
      provide: GENRE_REPOSITORY,
      useClass: GenreRepositoryImpl,
    },
    {
      provide: DEMOGRAPHIC_REPOSITORY,
      useClass: DemographicRepositoryImpl,
    },
  ],
  exports: [
    MANGA_REPOSITORY,
    CHAPTER_REPOSITORY,
    GENRE_REPOSITORY,
    DEMOGRAPHIC_REPOSITORY,
  ],
})
export class InfrastructureModule {}
