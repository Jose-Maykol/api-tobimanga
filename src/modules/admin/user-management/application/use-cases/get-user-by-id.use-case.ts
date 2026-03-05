import { Inject, Injectable, Logger } from '@nestjs/common'

import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { UserManagementRepository } from '../../domain/repositories/user-management.repository'
import { USER_MANAGEMENT_REPOSITORY } from '../../domain/tokens'

@Injectable()
export class GetUserByIdUseCase {
  private readonly logger = new Logger(GetUserByIdUseCase.name)

  constructor(
    @Inject(USER_MANAGEMENT_REPOSITORY)
    private readonly userManagementRepository: UserManagementRepository,
  ) {}

  async execute(id: string) {
    this.logger.log(`Getting user by id: ${id}`)

    const user = await this.userManagementRepository.findById(id)
    if (!user) {
      throw new UserNotFoundException(id)
    }

    return user
  }
}
