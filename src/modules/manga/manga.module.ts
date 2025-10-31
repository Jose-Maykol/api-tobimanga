import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/core/database/database.module'
import { StorageModule } from '@/core/storage/storage.module'

import { MangaFactory } from '../../core/domain/factories/manga/manga.factory'
import { AuthModule } from '../auth/auth.module'
import { FindPaginatedMangaUseCase } from './application/use-cases/find-paginated-manga.use-case'
import { FindPaginatedMangaManagementUseCase } from './application/use-cases/find-paginated-manga-management.use-case'
import { MangaReadRepository } from './infrastructure/repositories/manga.read.repository'
import { MangaController } from './interface/controllers/manga.controller'

const useCases = [
  FindPaginatedMangaUseCase,
  FindPaginatedMangaManagementUseCase,
]

const repositories = [MangaReadRepository]

const factories = [MangaFactory]

@Module({
  imports: [DatabaseModule, StorageModule, AuthModule],
  controllers: [MangaController],
  providers: [...useCases, ...repositories, ...factories],
})
export class MangaModule {}
