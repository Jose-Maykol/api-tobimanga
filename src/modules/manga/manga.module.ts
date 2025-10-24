import { Module } from '@nestjs/common'
import { CreateMangaUseCase } from './application/use-cases/create-manga.use-case'
import { FindPaginatedMangaUseCase } from './application/use-cases/find-paginated-manga.use-case'
import { MangaReadRepository } from './infrastructure/repositories/manga.read.repository'
import { DatabaseModule } from '@/core/database/database.module'
import { AuthModule } from '../auth/auth.module'
import { MangaController } from './interface/controllers/manga.controller'
import { MangaRepositoryImpl } from './infrastructure/repositories/manga.repository.impl'
import { AuthorModule } from '../author/author.module'
import { GenreModule } from '../genres/genre.module'
import { DemographicModule } from '../demographic/demographic.module'
import { StorageModule } from '@/core/storage/storage.module'
import { MangaFactory } from './domain/factories/manga.factory'
import { FindPaginatedMangaManagementUseCase } from './application/use-cases/find-paginated-manga-management.use-case'
import { ChapterRepositoryImpl } from './infrastructure/repositories/chapter.repository.impl'

const useCases = [
  CreateMangaUseCase,
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
