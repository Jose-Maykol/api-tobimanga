import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ROLES } from '@/common/constants/roles.const'
import { ResponseBuilder } from '@/common/utils/response.util'
import { MangaAlreadyExistsException } from '@/core/domain/exceptions/manga/manga-already-exists'
import { CreateMangaDto } from '@/modules/admin/manga-management/application/dtos/create-manga.dto'
import { Roles } from '@/modules/auth/interface/decorators/roles.decorator'
import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'
import { RolesGuard } from '@/modules/auth/interface/guards/roles.guard'

import { CreateMangaUseCase } from '../../application/use-cases/create-manga.use-case'
import { ListMangasUseCase } from '../../application/use-cases/list-mangas.use-case'
import { MangaManagementSwagger } from '../swagger/manga-management.swagger'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN)
@Controller()
@ApiTags('Gestión de Mangas')
export class MangaManagementController {
  constructor(
    @Inject()
    private readonly createMangaUseCase: CreateMangaUseCase,
    @Inject()
    private readonly listMangasUseCase: ListMangasUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo manga',
    description:
      'Crea una nueva entidad manga. Solo accesible por usuarios ADMIN.',
  })
  @ApiBody(MangaManagementSwagger.create.body)
  @ApiResponse(MangaManagementSwagger.create.responses.created)
  @ApiResponse(MangaManagementSwagger.create.responses.conflict)
  @ApiBearerAuth()
  async create(@Body() createMangaDto: CreateMangaDto) {
    try {
      const result = await this.createMangaUseCase.execute(createMangaDto)
      return ResponseBuilder.success({
        message: 'Manga creado exitosamente',
        data: result,
      })
    } catch (error) {
      if (error instanceof MangaAlreadyExistsException) {
        throw new HttpException(
          ResponseBuilder.error(error.message, error.code, HttpStatus.CONFLICT),
          HttpStatus.CONFLICT,
        )
      }
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Listar mangas',
    description: 'Obtiene una lista de mangas con paginación.',
  })
  async getAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    const mangas = await this.listMangasUseCase.execute({ page, limit })
    return ResponseBuilder.success({
      data: mangas.items,
      meta: mangas.meta,
    })
  }
}
