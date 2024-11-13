import { Controller, Get } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { FindGenresQuery } from '../../application/queries/find-genres.query'

@Controller()
export class GenreController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('genres')
  async findGenres() {
    const query = new FindGenresQuery()
    return await this.queryBus.execute(query)
  }
}
