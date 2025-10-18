import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'
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
import { CreateMangaDto } from '../../application/dtos/create-manga.dto'
import { CreateMangaUseCase } from '../../application/use-cases/create-manga.use-case'
import { ResponseBuilder } from '@/common/utils/response.util'
import { PaginationDto } from '@/common/dto/pagination.dto'
import { FindPaginatedMangaUseCase } from '../../application/use-cases/find-paginated-manga.use-case'
import { FindPaginatedMangaManagementUseCase } from '../../application/use-cases/find-paginated-manga-management.use-case'
import { MangaAlreadyExistsException } from '../../domain/exceptions/manga-already-exists'

@Controller()
export class MangaController {
  constructor(
    @Inject()
    private readonly createMangaUseCase: CreateMangaUseCase,
    @Inject()
    private readonly findPaginatedMangaUseCase: FindPaginatedMangaUseCase,
    @Inject()
    private readonly findPaginatedMangaManagementUseCase: FindPaginatedMangaManagementUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createMangaDto: CreateMangaDto) {
    try {
      const result = await this.createMangaUseCase.execute(createMangaDto)

      return ResponseBuilder.success({
        message: 'Manga creado exitosamente',
        data: {
          manga: result,
        },
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
  @UseGuards(JwtAuthGuard)
  async findPaginated(@Query() pagination: PaginationDto) {
    try {
      const { page = 1, limit = 10 } = pagination
      const result = await this.findPaginatedMangaUseCase.execute(page, limit)
      return ResponseBuilder.success({
        message: 'Mangas obtenidos exitosamente',
        data: {
          mangas: result.items,
        },
        meta: {
          pagination: result.pagination,
        },
      })
    } catch (error) {}
  }

  @Get('management')
  @UseGuards(JwtAuthGuard)
  async findPaginatedForManagement(@Query() pagination: PaginationDto) {
    try {
      const { page, limit } = pagination
      const result = await this.findPaginatedMangaManagementUseCase.execute(
        page,
        limit,
      )
      return ResponseBuilder.success({
        message: 'Mangas obtenidos exitosamente',
        data: {
          mangas: result.items,
        },
        meta: {
          pagination: result.pagination,
        },
      })
    } catch (error) {}
  }
}
