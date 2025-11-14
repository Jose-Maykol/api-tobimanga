import { Inject, Injectable, Logger } from '@nestjs/common'

import { UserRepository } from '@/core/domain/repositories/user.repository'

import { User } from '../../../../core/domain/entities/user.entity'
import { UserNotFoundException } from '../../../../core/domain/exceptions/user/user-not-found.exception'

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
      throw new UserNotFoundException()
    }

    this.logger.log(`User found for id: ${id}, email: ${user.email}`)

    return user
  }
}
