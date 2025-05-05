import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { PaginationDto } from '../../../manga/interface/dto/pagination.dto'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { FindPaginatedAdminMangasQuery } from '../../../manga/application/queries/find-paginated-admin-mangas.query'
import { JwtAuthGuard } from '@/modules/v1/auth/interface/guards/auth.guard'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Mangas')
@Controller('mangas')
export class AdminMangasController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener mangas paginados para admin' })
  @ApiBody({
    description: 'Consulta para obtener mangas paginados para admin',
  })
  @UseGuards(JwtAuthGuard)
  async findPaginatedMangas(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination
    const query = new FindPaginatedAdminMangasQuery({ page, limit })
    return await this.queryBus.execute(query)
  }
}
