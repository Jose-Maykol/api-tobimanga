import { Controller, Get } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { FindDemographicsQuery } from '../../application/queries/find-demographics.query'

@Controller()
export class DemographicController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('demographics')
  async findDemographics() {
    const query = new FindDemographicsQuery()
    return await this.queryBus.execute(query)
  }
}
