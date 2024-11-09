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

@Module({
  imports: [CqrsModule, DatabaseModule, CloudinaryModule],
  controllers: [MangaController],
  providers: [
    DrizzleService,
    CloudinaryService,
    FindPaginatedMangasHandler,
    SaveMangaHandler,
    {
      provide: 'MangaRepository',
      useClass: MangaRepositoryImpl,
    },
    {
      provide: 'AuthorRepository',
      useClass: AuthorRepositoryImpl,
    },
    {
      provide: 'GenreRepository',
      useClass: GenreRepositoryImpl,
    },
    {
      provide: 'DemographicRepository',
      useClass: DemographicRepositoryImpl,
    },
    MangaFactory,
  ],
})
export class MangaModule {}
