import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/core/database/database.module'

import { GetUserByEmailUseCase } from './application/use-cases/get-user-by-email.use-case'
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case'
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case'
import { UserRepositoryImpl } from './infrastructure/repositories/user.repository.impl'

const useCases = [
  RegisterUserUseCase,
  GetUserByIdUseCase,
  GetUserByEmailUseCase,
]

const services = []

const repositories = [
  {
    provide: 'UserRepository',
    useClass: UserRepositoryImpl,
  },
]

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [...useCases, ...repositories, ...services],
  exports: [...useCases, ...services, 'UserRepository'],
})
export class UserModule {}
