import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { FindGenresQuery } from '../../application/queries/find-genres.query'
import {
  SaveGenreDto,
  saveGenreSchema,
  SaveGenreSwaggerDto,
} from '../dto/save-genre.dto'
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe'
import { SaveGenreCommand } from '../../application/commands/save-genre.command'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Géneros')
@Controller('genres')
export class GenreController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los géneros' })
  @ApiBody({
    description: 'Consulta para obtener todos los géneros',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de géneros obtenida exitosamente',
    schema: {
      example: {
        genres: [
          {
            id: '6d28a337-4d5d-41eb-a678-dab307a0e5ef',
            name: 'Acción',
          },
          {
            id: '3a15e3fc-321e-4062-850d-91c26c29bd14',
            name: 'Aventura',
          },
          {
            id: '788b36ce-6c82-4460-8bce-ad6c1c53e4f1',
            name: 'Comedia',
          },
        ],
      },
    },
  })
  async findGenres() {
    const query = new FindGenresQuery()
    return await this.queryBus.execute(query)
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo género' })
  @ApiBody({
    description: 'Datos necesarios para crear un nuevo género',
    type: SaveGenreSwaggerDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Género creado exitosamente',
    schema: {
      example: {
        message: 'Género creado exitosamente',
        genre: {
          id: '6d28a337-4d5d-41eb-a678-dab307a0e5ef',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error al crear el género',
    schema: {
      example: {
        statusCode: 400,
        message: 'El nombre del género es requerido',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'El género ya existe',
    schema: {
      example: {
        statusCode: 409,
        message: 'El género ya existe',
        error: 'Conflict',
      },
    },
  })
  @UsePipes(new ZodValidationPipe(saveGenreSchema))
  async createGenre(@Body() saveGenreDto: SaveGenreDto) {
    const command = new SaveGenreCommand(saveGenreDto)
    return await this.commandBus.execute(command)
  }
}
