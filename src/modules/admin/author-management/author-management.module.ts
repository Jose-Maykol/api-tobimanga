import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/core/database/database.module'

import { AuthModule } from '../../auth/auth.module'
import { CreateAuthorUseCase } from './application/use-cases/create-author.use-case'
import { DeleteAuthorUseCase } from './application/use-cases/delete-author.use-case'
import { GetAllAuthorsUseCase } from './application/use-cases/get-all-authors.use-case'
import { GetAuthorByIdUseCase } from './application/use-cases/get-author-by-id.use-case'
import { UpdateAuthorUseCase } from './application/use-cases/update-author.use-case'
import { AuthorRepositoryImpl } from './infrastructure/repositories/author.repository.impl'
import { AUTHOR_REPOSITORY } from './domain/tokens'
import { AuthorManagementController } from './interface/controllers/author-management.controller'

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [AuthorManagementController],
  providers: [
    { provide: AUTHOR_REPOSITORY, useClass: AuthorRepositoryImpl },
    CreateAuthorUseCase,
    DeleteAuthorUseCase,
    GetAllAuthorsUseCase,
    GetAuthorByIdUseCase,
    UpdateAuthorUseCase,
  ],
  exports: [CreateAuthorUseCase, GetAllAuthorsUseCase, GetAuthorByIdUseCase],
})
export class AuthorManagementModule { }
