import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/core/database/database.module'
import { StorageModule } from '@/core/storage/storage.module'

import { MangaFactory } from '../../core/domain/factories/manga/manga.factory'
import { AuthModule } from '../auth/auth.module'
import { FindChaptersByMangaUseCase } from './application/use-cases/find-chapters-by-manga.use-case'
import { FindPaginatedMangaUseCase } from './application/use-cases/find-paginated-manga.use-case'
import { FindPaginatedMangaManagementUseCase } from './application/use-cases/find-paginated-manga-management.use-case'
import { ChapterReadRepository } from './infrastructure/repositories/chapter.read.repository'
import { MangaReadRepository } from './infrastructure/repositories/manga.read.repository'
import { ChapterController } from './interface/controllers/chapter.controller'
import { MangaController } from './interface/controllers/manga.controller'

const useCases = [
  FindPaginatedMangaUseCase,
  FindPaginatedMangaManagementUseCase,
  FindChaptersByMangaUseCase,
]

const repositories = [MangaReadRepository, ChapterReadRepository]

const factories = [MangaFactory]

@Module({
  imports: [DatabaseModule, StorageModule, AuthModule],
  controllers: [MangaController, ChapterController],
  providers: [...useCases, ...repositories, ...factories],
})
export class MangaModule {}
