import { DatabaseModule } from '@/core/database/database.module'
import { Module } from '@nestjs/common'
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case'

const useCases = [RegisterUserUseCase]

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [...useCases],
  exports: [...useCases],
})
export class UserModule {}
