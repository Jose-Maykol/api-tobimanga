import { Inject, Injectable } from '@nestjs/common'
import { UserNotFoundException } from '../../../../core/domain/exceptions/user/user-not-found.exception'
import { User } from '../../../../core/domain/entities/user.entity'
import { UserRepository } from '@/core/domain/repositories/user.repository'

@Injectable()
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
