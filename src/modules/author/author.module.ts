import { DatabaseModule } from '@/core/database/database.module'
import { CreateAuthorUseCase } from './application/use-cases/create-author.use-case'
import { GetAllAuthorsUseCase } from './application/use-cases/get-all-authors.use-case'
import { GetAuthorsByIdsUseCase } from './application/use-cases/get-authors-by-ids.use-case'
import { AuthorRepositoryImpl } from './infrastructure/repositories/author.repository.impl'
import { Module } from '@nestjs/common'
import { AuthorController } from './interface/controllers/author.controller'
import { AuthModule } from '../auth/auth.module'

const useCases = [
  CreateAuthorUseCase,
  GetAllAuthorsUseCase,
  GetAuthorsByIdsUseCase,
]

const repositories = [
  {
    provide: 'AuthorRepository',
    useClass: AuthorRepositoryImpl,
  },
]

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [AuthorController],
  providers: [...repositories, ...useCases],
  exports: [
    'AuthorRepository',
    CreateAuthorUseCase,
    GetAllAuthorsUseCase,
    GetAuthorsByIdsUseCase,
  ],
})
export class AuthorModule {}
