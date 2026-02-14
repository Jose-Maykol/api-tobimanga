import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/core/database/database.module'
import { AuthModule } from '@/modules/auth/auth.module'

import { CreateGenreUseCase } from './application/use-cases/create-genre.use-case'
import { DeleteGenreUseCase } from './application/use-cases/delete-genre.use-case'
import { GetAllGenresUseCase } from './application/use-cases/get-all-genres.use-case'
import { GetGenreByIdUseCase } from './application/use-cases/get-genre-by-id.use-case'
import { UpdateGenreUseCase } from './application/use-cases/update-genre.use-case'
import { GenreRepositoryImpl } from './infrastructure/repositories/genre.repository.impl'
import { GENRE_REPOSITORY } from './domain/tokens'
import { GenreManagementController } from './interface/controllers/genre-management.controller'

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [
    { provide: GENRE_REPOSITORY, useClass: GenreRepositoryImpl },
    CreateGenreUseCase,
    DeleteGenreUseCase,
    GetAllGenresUseCase,
    GetGenreByIdUseCase,
    UpdateGenreUseCase,
  ],
  controllers: [GenreManagementController],
  exports: [GetAllGenresUseCase, GetGenreByIdUseCase],
})
export class GenreManagementModule { }
