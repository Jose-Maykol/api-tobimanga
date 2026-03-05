import { Inject, Injectable, Logger } from '@nestjs/common'

import { CannotModifySelfException } from '../../domain/exceptions/cannot-modify-self.exception'
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { UserManagementRepository } from '../../domain/repositories/user-management.repository'
import { USER_MANAGEMENT_REPOSITORY } from '../../domain/tokens'

@Injectable()
export class DeactivateUserUseCase {
  private readonly logger = new Logger(DeactivateUserUseCase.name)

  constructor(
    @Inject(USER_MANAGEMENT_REPOSITORY)
    private readonly userManagementRepository: UserManagementRepository,
  ) {}

  async execute(targetUserId: string, requestingUserId: string) {
    if (targetUserId === requestingUserId) {
      this.logger.warn(
        `User ${requestingUserId} tried to deactivate their own account`,
      )
      throw new CannotModifySelfException()
    }

    this.logger.log(
      `Deactivating user ${targetUserId} requested by ${requestingUserId}`,
    )

    const user = await this.userManagementRepository.findById(targetUserId)
    if (!user) {
      throw new UserNotFoundException(targetUserId)
    }

    const updated = await this.userManagementRepository.deactivate(targetUserId)

    this.logger.log(`User ${targetUserId} deactivated successfully`)

    return updated
  }
}
