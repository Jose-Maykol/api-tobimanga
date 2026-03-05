import { Inject, Injectable, Logger } from '@nestjs/common'

import { calculatePagination } from '@/common/utils/pagination.util'

import { UserManagementRepository } from '../../domain/repositories/user-management.repository'
import { USER_MANAGEMENT_REPOSITORY } from '../../domain/tokens'
import { ListUsersDto } from '../dtos/list-users.dto'

@Injectable()
export class ListUsersUseCase {
  private readonly logger = new Logger(ListUsersUseCase.name)

  constructor(
    @Inject(USER_MANAGEMENT_REPOSITORY)
    private readonly userManagementRepository: UserManagementRepository,
  ) {}

  async execute(dto: ListUsersDto) {
    const page = dto.page ?? 1
    const limit = dto.limit ?? 20

    this.logger.log(
      `Listing users - page: ${page}, limit: ${limit}, isActive: ${dto.isActive}`,
    )

    const { items, total } = await this.userManagementRepository.findAll({
      page,
      limit,
      isActive: dto.isActive,
    })

    const meta = calculatePagination(total, page, limit)

    this.logger.log(`Retrieved ${items.length} users (total: ${total})`)

    return { items, meta }
  }
}
