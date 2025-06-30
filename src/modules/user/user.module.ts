import { DatabaseModule } from '@/core/database/database.module'
import { Module } from '@nestjs/common'
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case'
import { UserRepositoryImpl } from './infrastructure/repositories/user.repository.impl'
import { GetUserByEmailUseCase } from './application/use-cases/get-user-by-email.use-case'
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case'

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
