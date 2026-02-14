import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/core/database/database.module'
import { StorageModule } from '@/core/storage/storage.module'
import { AuthModule } from '@/modules/auth/auth.module'

import { AuthorManagementModule } from '../author-management/author-management.module'
import { DemographicManagementModule } from '../demographic-management/demographic-management.module'
import { GenreManagementModule } from '../genre-management/genre-management.module'
import { UploadModule } from '../upload/upload.module'
import { CreateChapterUseCase } from './application/use-cases/create-chapter.use-case'
import { CreateMangaUseCase } from './application/use-cases/create-manga.use-case'
import { FindMangaByIdUseCase } from './application/use-cases/find-manga-by-id.use-case'
import { ListChaptersByMangaUseCase } from './application/use-cases/list-chapters-by-manga.use-case'
import { ListMangasUseCase } from './application/use-cases/list-mangas.use-case'
import { UpdateChapterUseCase } from './application/use-cases/update-chapter.use-case'
import { UpdateMangaUseCase } from './application/use-cases/update-manga.use-case'
import { ChapterFactory } from './domain/factories/chapter.factory'
import { MangaFactory } from './domain/factories/manga.factory'
import { CHAPTER_REPOSITORY, MANGA_REPOSITORY } from './domain/tokens'
import { ChapterRepositoryImpl } from './infrastructure/repositories/chapter.repository.impl'
import { MangaRepositoryImpl } from './infrastructure/repositories/manga.repository.impl'
import { MangaManagementController } from './interface/controllers/manga-management.controller'

@Module({
  imports: [
    DatabaseModule,
    StorageModule,
    AuthModule,
    GenreManagementModule,
    DemographicManagementModule,
    AuthorManagementModule,
    UploadModule,
  ],
  providers: [
    { provide: MANGA_REPOSITORY, useClass: MangaRepositoryImpl },
    { provide: CHAPTER_REPOSITORY, useClass: ChapterRepositoryImpl },
    CreateMangaUseCase,
    FindMangaByIdUseCase,
    ListMangasUseCase,
    UpdateMangaUseCase,
    ListChaptersByMangaUseCase,
    CreateChapterUseCase,
    UpdateChapterUseCase,
    MangaFactory,
    ChapterFactory,
  ],
  controllers: [MangaManagementController],
  exports: [CreateMangaUseCase, ListMangasUseCase, UpdateMangaUseCase],
})
export class MangaManagementModule {}
