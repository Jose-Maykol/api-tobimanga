import { Module } from '@nestjs/common'

import { AuthorRepositoryImpl } from './repositories/author.repository.impl'
import { ChapterRepositoryImpl } from './repositories/chapter.repository.impl'
import { DemographicRepositoryImpl } from './repositories/demographic.repository.impl'
import { GenreRepositoryImpl } from './repositories/genre.repository.impl'
import { MangaRepositoryImpl } from './repositories/manga.repository.impl'
import {
  AUTHOR_REPOSITORY,
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
    {
      provide: AUTHOR_REPOSITORY,
      useClass: AuthorRepositoryImpl,
    },
  ],
  exports: [
    MANGA_REPOSITORY,
    CHAPTER_REPOSITORY,
    GENRE_REPOSITORY,
    DEMOGRAPHIC_REPOSITORY,
    AUTHOR_REPOSITORY,
  ],
})
export class InfrastructureModule {}
