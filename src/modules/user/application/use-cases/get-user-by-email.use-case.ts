import { Inject, Injectable, Logger } from '@nestjs/common'

import { UserRepository } from '@/core/domain/repositories/user.repository'

import { User } from '../../../../core/domain/entities/user.entity'
import { UserNotFoundException } from '../../../../core/domain/exceptions/user/user-not-found.exception'

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
      throw new UserNotFoundException()
    }

    this.logger.log(`User found for email: ${email}, userId: ${user.id}`)

    return user
  }
}
