import { Inject } from '@nestjs/common'
import { UserRepository } from '../../domain/repositories/user.repository'
import { User } from '../../domain/entities/user'

export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, data: Partial<User>): Promise<void> {
    await this.userRepository.update(id, data)
  }
}
