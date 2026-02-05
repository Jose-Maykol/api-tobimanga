import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/core/database/database.module'
import { InfrastructureModule } from '@/infrastructure/infraestructure.module'

import { AuthModule } from '../../auth/auth.module'
import { CreateAuthorUseCase } from './application/use-cases/create-author.use-case'
import { DeleteAuthorUseCase } from './application/use-cases/delete-author.use-case'
import { GetAllAuthorsUseCase } from './application/use-cases/get-all-authors.use-case'
import { GetAuthorByIdUseCase } from './application/use-cases/get-author-by-id.use-case'
import { UpdateAuthorUseCase } from './application/use-cases/update-author.use-case'
import { AuthorManagementController } from './interface/controllers/author-management.controller'

@Module({
  imports: [InfrastructureModule, DatabaseModule, AuthModule],
  controllers: [AuthorManagementController],
  providers: [
    CreateAuthorUseCase,
    DeleteAuthorUseCase,
    GetAllAuthorsUseCase,
    GetAuthorByIdUseCase,
    UpdateAuthorUseCase,
  ],
  exports: [CreateAuthorUseCase, GetAllAuthorsUseCase, GetAuthorByIdUseCase],
})
export class AuthorManagementModule {}
