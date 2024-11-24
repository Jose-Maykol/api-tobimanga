import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { SaveAuthorDto, saveAuthorSchema } from '../dto/save-author.dto'
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe'
import { SaveAuthorCommand } from '../../application/commands/save-author.command'
import { FindAuthorsQuery } from '../../application/queries/find-authors.query'

@Controller('authors')
export class AuthorController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async findAuthors() {
    const query = new FindAuthorsQuery()
    return await this.queryBus.execute(query)
  }

  @Post()
  @UsePipes(new ZodValidationPipe(saveAuthorSchema))
  async createAuthor(@Body() saveAuthorDto: SaveAuthorDto) {
    const command = new SaveAuthorCommand(saveAuthorDto)
    return await this.commandBus.execute(command)
  }
}
