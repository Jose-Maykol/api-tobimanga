import { Inject, Injectable, Logger } from '@nestjs/common'

import { User } from '../../domain/entities/auth-user.entity'
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { UserRepository } from '../../domain/repositories/auth-user.repository'

@Injectable()
export class GetUserByEmailUseCase {
  private readonly logger = new Logger(GetUserByEmailUseCase.name)

  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string): Promise<User> {
    this.logger.log(`Searching user by email: ${email}`)

    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      this.logger.warn(`User not found for email: ${email}`)
      throw new UserNotFoundException(email)
    }

    this.logger.log(`User found for email: ${email}, userId: ${user.id}`)

    return user
  }
}
