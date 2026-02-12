import { Inject, Injectable, Logger } from '@nestjs/common'

import { User } from '@/core/domain/entities/user.entity'
import { UserNotFoundException } from '@/modules/user/domain/exceptions/user-not-found.exception'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'

@Injectable()
export class GetUserByIdUseCase {
  private readonly logger = new Logger(GetUserByIdUseCase.name)

  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<User> {
    this.logger.log(`Searching user by id: ${id}`)

    const user = await this.userRepository.findById(id)
    if (!user) {
      this.logger.warn(`User not found for id: ${id}`)
      throw new UserNotFoundException(id)
    }

    this.logger.log(`User found for id: ${id}, email: ${user.email}`)

    return user
  }
}
