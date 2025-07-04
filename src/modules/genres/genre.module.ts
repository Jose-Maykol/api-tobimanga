import { DatabaseModule } from '@/core/database/database.module'
import { CreateGenreUseCase } from './application/use-cases/create-genre.use-case'
import { GetAllGenresUseCase } from './application/use-cases/get-all-genres.use-case'
import { GetGenreByIdUseCase } from './application/use-cases/get-genre-by-id.use-case'
import { GenreRepositoryImpl } from './infrastructure/repositories/genre.repository.impl'
import { AuthModule } from '../auth/auth.module'
import { Module } from '@nestjs/common'
import { GenreController } from './interface/controllers/genre.controller'

const useCases = [CreateGenreUseCase, GetAllGenresUseCase, GetGenreByIdUseCase]

const repositories = [
  {
    provide: 'GenreRepository',
    useClass: GenreRepositoryImpl,
  },
]

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [GenreController],
  providers: [...repositories, ...useCases],
  exports: [
    'GenreRepository',
    CreateGenreUseCase,
    GetAllGenresUseCase,
    GetGenreByIdUseCase,
  ],
})
export class GenreModule {}
