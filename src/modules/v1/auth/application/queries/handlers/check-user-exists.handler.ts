import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { CheckUserExistsQuery } from '../check-user-exists.query'
import { Inject, NotFoundException } from '@nestjs/common'
import { UserRepository } from '../../../domain/repositories/user.repository'

@QueryHandler(CheckUserExistsQuery)
export class ValidateTokenHandler
  implements IQueryHandler<CheckUserExistsQuery>
{
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: CheckUserExistsQuery) {
    const { id } = query
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new NotFoundException('Usuario no encontrado')
    }
  }
}
