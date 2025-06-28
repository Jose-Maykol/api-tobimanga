import { Inject } from '@nestjs/common'
import { UserRepository } from '../../domain/repositories/user.repository'
import { User } from '../../domain/entities/user'
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'

export class GetUserByIdUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new UserNotFoundException()
    }
    return user
  }
}
