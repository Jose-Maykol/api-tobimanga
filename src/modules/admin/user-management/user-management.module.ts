import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/core/database/database.module'

import { AuthModule } from '../../auth/auth.module'
import { ActivateUserUseCase } from './application/use-cases/activate-user.use-case'
import { DeactivateUserUseCase } from './application/use-cases/deactivate-user.use-case'
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case'
import { ListUsersUseCase } from './application/use-cases/list-users.use-case'
import { USER_MANAGEMENT_REPOSITORY } from './domain/tokens'
import { UserManagementRepositoryImpl } from './infrastructure/repositories/user-management.repository.impl'
import { UserManagementController } from './interface/controllers/user-management.controller'

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [UserManagementController],
  providers: [
    {
      provide: USER_MANAGEMENT_REPOSITORY,
      useClass: UserManagementRepositoryImpl,
    },
    ListUsersUseCase,
    GetUserByIdUseCase,
    DeactivateUserUseCase,
    ActivateUserUseCase,
  ],
})
export class UserManagementModule {}
