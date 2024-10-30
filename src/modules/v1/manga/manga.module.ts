import { DatabaseModule } from '@/modules/database/database.module'
import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { MangaController } from './interface/controllers/manga.controller'
import { FindPaginatedMangasHandler } from './application/queries/handlers/find-paginated-mangas.handler'
import { MangaRepositoryImpl } from './infrastructure/repositories/manga.repository.impl'
import { CloudinaryModule } from '@/cloudinary/cloudinary.module'
import { CloudinaryService } from '@/cloudinary/cloudinary.service'

@Module({
  imports: [CqrsModule, DatabaseModule, CloudinaryModule],
  controllers: [MangaController],
  providers: [
    DrizzleService,
    CloudinaryService,
    FindPaginatedMangasHandler,
    {
      provide: 'MangaRepository',
      useClass: MangaRepositoryImpl,
    },
  ],
})
export class MangaModule {}
