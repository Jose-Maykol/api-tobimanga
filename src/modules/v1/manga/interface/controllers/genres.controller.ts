import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { FindGenresQuery } from '../../application/queries/find-genres.query'
import { SaveGenreDto, saveGenreSchema } from '../dto/save-genre.dto'
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe'
import { SaveGenreCommand } from '../../application/commands/save-genre.handler'

@Controller('genres')
export class GenreController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async findGenres() {
    const query = new FindGenresQuery()
    return await this.queryBus.execute(query)
  }

  @Post()
  @UsePipes(new ZodValidationPipe(saveGenreSchema))
  async createGenre(@Body() saveGenreDto: SaveGenreDto) {
    const command = new SaveGenreCommand(saveGenreDto)
    return await this.commandBus.execute(command)
  }
}
