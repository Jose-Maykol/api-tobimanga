import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/core/database/database.module'
import { InfrastructureModule } from '@/infrastructure/infraestructure.module'
import { AuthModule } from '@/modules/auth/auth.module'

import { CreateGenreUseCase } from './application/use-cases/create-genre.use-case'
import { GetAllGenresUseCase } from './application/use-cases/get-all-genres.use-case'
import { GetGenreByIdUseCase } from './application/use-cases/get-genre-by-id.use-case'
import { GenreManagementController } from './interface/controllers/genre-management.controller'

@Module({
  imports: [InfrastructureModule, DatabaseModule, AuthModule],
  providers: [CreateGenreUseCase, GetAllGenresUseCase, GetGenreByIdUseCase],
  controllers: [GenreManagementController],
  exports: [GetAllGenresUseCase, GetGenreByIdUseCase],
})
export class GenreManagementModule {}
