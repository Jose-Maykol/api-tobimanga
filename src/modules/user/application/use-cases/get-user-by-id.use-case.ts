import { Inject, Injectable } from '@nestjs/common'
import { User } from '../../../../core/domain/entities/user.entity'
import { UserNotFoundException } from '../../../../core/domain/exceptions/user/user-not-found.exception'
import { UserRepository } from '@/core/domain/repositories/user.repository'

@Injectable()
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
