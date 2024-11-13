import { Controller, Get } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { FindAuthorsQuery } from '../../application/queries/find-authors.query'

@Controller()
export class AuthorController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('authors')
  async findAuthors() {
    const query = new FindAuthorsQuery()
    return await this.queryBus.execute(query)
  }
}
