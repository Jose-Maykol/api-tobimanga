import { AuthController } from '@/auth/auth.controller'
import { DatabaseModule } from '@/modules/database/database.module'
import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { RegisterUserCommand } from './application/commands/register-user.command'
import { UserFactory } from './domain/factories/user.factory'
import { UserRepositoryImpl } from './infrastructure/repositories/user.repository.impl'

const CommandHandlers = [RegisterUserCommand]
const QueryHandlers = []
const Factories = [UserFactory]
const Repositories = [
  { provide: 'UserRepository', useClass: UserRepositoryImpl },
]

@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [AuthController],
  providers: [
    DrizzleService,
    ...CommandHandlers,
    ...QueryHandlers,
    ...Factories,
    ...Repositories,
  ],
})
export class AuthModule {}
