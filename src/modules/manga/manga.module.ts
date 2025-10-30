import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/core/database/database.module'
import { StorageModule } from '@/core/storage/storage.module'
import { MangaRepositoryImpl } from '@/infrastructure/repositories/manga.repository.impl'

import { MangaFactory } from '../../core/domain/factories/manga/manga.factory'
import { ChapterRepositoryImpl } from '../../infrastructure/repositories/chapter.repository.impl'
import { AuthModule } from '../auth/auth.module'
import { AuthorModule } from '../author/author.module'
import { DemographicModule } from '../demographic/demographic.module'
import { GenreModule } from '../genres/genre.module'
import { FindPaginatedMangaUseCase } from './application/use-cases/find-paginated-manga.use-case'
import { FindPaginatedMangaManagementUseCase } from './application/use-cases/find-paginated-manga-management.use-case'
import { MangaReadRepository } from './infrastructure/repositories/manga.read.repository'
import { MangaController } from './interface/controllers/manga.controller'

const useCases = [
  FindPaginatedMangaUseCase,
  FindPaginatedMangaManagementUseCase,
]

const repositories = [
  {
    provide: 'MangaRepository',
    useClass: MangaRepositoryImpl,
  },
  {
    provide: 'ChapterRepository',
    useClass: ChapterRepositoryImpl,
  },
  MangaReadRepository,
]

const factories = [MangaFactory]

@Module({
  imports: [
    DatabaseModule,
    StorageModule,
    AuthModule,
    AuthorModule,
    GenreModule,
    DemographicModule,
  ],
  controllers: [MangaController],
  providers: [...useCases, ...repositories, ...factories],
})
export class MangaModule {}
