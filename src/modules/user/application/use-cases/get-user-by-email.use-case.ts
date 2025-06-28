import { Inject } from '@nestjs/common'
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { UserRepository } from '../../domain/repositories/user.repository'
import { User } from '../../domain/entities/user'

export class GetUserByEmailUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new UserNotFoundException()
    }
    return user
  }
}
