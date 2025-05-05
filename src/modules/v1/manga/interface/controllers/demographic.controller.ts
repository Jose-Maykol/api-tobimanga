import { Controller, Get } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { FindDemographicsQuery } from '../../application/queries/find-demographics.query'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Demografias')
@Controller()
export class DemographicController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('demographics')
  @ApiOperation({ summary: 'Obtener todos los demográficos' })
  @ApiBody({
    description: 'Consulta para obtener todas demografias',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de demográficos obtenida exitosamente',
    schema: {
      example: {
        demographics: [
          {
            id: '11ec43f3-d436-41f7-ba81-621119a28d89',
            name: 'Kodomo',
          },
          {
            id: 'ad697948-952e-47f3-8937-68bc56fafba7',
            name: 'Shonen',
          },
          {
            id: '480d4b48-61fe-40b0-8024-48a3bbc293d6',
            name: 'Shojo',
          },
        ],
      },
    },
  })
  async findDemographics() {
    const query = new FindDemographicsQuery()
    return await this.queryBus.execute(query)
  }
}
