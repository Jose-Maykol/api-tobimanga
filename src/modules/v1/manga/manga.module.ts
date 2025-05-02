import { DatabaseModule } from '@/modules/database/database.module'
import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { MangaController } from './interface/controllers/manga.controller'
import { FindPaginatedMangasHandler } from './application/queries/handlers/find-paginated-mangas.handler'
import { MangaRepositoryImpl } from './infrastructure/repositories/manga.repository.impl'
import { CloudinaryModule } from '@/cloudinary/cloudinary.module'
import { CloudinaryService } from '@/cloudinary/cloudinary.service'
import { SaveMangaHandler } from './application/commands/handlers/save-manga.handler'
import { AuthorRepositoryImpl } from './infrastructure/repositories/author.repository.impl'
import { GenreRepositoryImpl } from './infrastructure/repositories/genre.repository.impl'
import { DemographicRepositoryImpl } from './infrastructure/repositories/demographic.repository.impl'
import { MangaFactory } from './domain/factories/manga.factory'
import { AuthorController } from './interface/controllers/author.controller'
import { FindAuthorsHandler } from './application/queries/handlers/find-authors.handler'
import { FindGenresHandler } from './application/queries/handlers/find-genres.handler'
import { GenreController } from './interface/controllers/genres.controller'
import { FindDemographicsHandler } from './application/queries/handlers/find-demographics.handler'
import { FindMangaHandler } from './application/queries/handlers/find-manga.handler'
import { DemographicController } from './interface/controllers/demographic.controller'
import { SaveAuthorHandler } from './application/commands/handlers/save-author.handler'
import { AuthorFactory } from './domain/factories/author.factory'
import { SaveGenreHandler } from './application/commands/handlers/save-genre.handler'
import { GenreFactory } from './domain/factories/genre.factory'
import { FindPaginatedChaptersHandler } from './application/queries/handlers/find-paginated-chapters.handler'
import { SyncAllMangasChaptersHandler } from './application/commands/handlers/sync-all-mangas-chapters.handler'
import { AuthorReadRepository } from './infrastructure/repositories/read/author-read.repository'
import { DemographicReadRepository } from './infrastructure/repositories/read/demographic-read.repository'
import { GenreReadRepository } from './infrastructure/repositories/read/genre-read.repository'
import { FindPaginatedAdminMangasHandler } from './application/queries/handlers/find-paginated-admin-mangas.handler'
import { MangaReadRepository } from './infrastructure/repositories/read/manga-read.repository'

const CommandHandlers = [
  SaveMangaHandler,
  SaveAuthorHandler,
  SaveGenreHandler,
  SyncAllMangasChaptersHandler,
]

const QueryHandlers = [
  FindPaginatedMangasHandler,
  FindPaginatedChaptersHandler,
  FindAuthorsHandler,
  FindGenresHandler,
  FindDemographicsHandler,
  FindMangaHandler,
  FindPaginatedAdminMangasHandler,
]

const Factories = [MangaFactory, AuthorFactory, GenreFactory]

const WriteRepositories = [
  { provide: 'MangaRepository', useClass: MangaRepositoryImpl },
  { provide: 'AuthorRepository', useClass: AuthorRepositoryImpl },
  { provide: 'GenreRepository', useClass: GenreRepositoryImpl },
  { provide: 'DemographicRepository', useClass: DemographicRepositoryImpl },
]

const ReadRepositories = [
  AuthorReadRepository,
  DemographicReadRepository,
  GenreReadRepository,
  MangaReadRepository,
]

@Module({
  imports: [CqrsModule, DatabaseModule, CloudinaryModule],
  controllers: [
    AuthorController,
    GenreController,
    DemographicController,
    MangaController, //*! Debe estar al final para evitar conflictos con las ruta manga/:slug
  ],
  providers: [
    DrizzleService,
    CloudinaryService,
    ...CommandHandlers,
    ...QueryHandlers,
    ...Factories,
    ...WriteRepositories,
    ...ReadRepositories,
  ],
})
export class MangaModule {}
