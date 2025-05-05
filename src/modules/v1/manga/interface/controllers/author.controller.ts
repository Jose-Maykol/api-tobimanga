import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import {
  SaveAuthorDto,
  saveAuthorSchema,
  SaveAuthorSwaggerDto,
} from '../dto/save-author.dto'
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe'
import { SaveAuthorCommand } from '../../application/commands/save-author.command'
import { FindAuthorsQuery } from '../../application/queries/find-authors.query'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Autores')
@Controller('authors')
export class AuthorController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los autores' })
  @ApiBody({
    description: 'Consulta para obtener todos los autores',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de autores obtenida exitosamente',
    schema: {
      example: {
        authors: [
          {
            id: '1faa4614-f0ff-4d25-8d81-50345619f544',
            name: 'Gege Akutami',
          },
          {
            id: '32fb6d75-1384-4fd0-b55d-19b3a9b824ec',
            name: 'Aka Akasaka',
          },
          {
            id: '503c65a6-58d3-43c7-a21e-ce717fd92e20',
            name: 'Mengo Yokoyari',
          },
        ],
      },
    },
  })
  async findAuthors() {
    const query = new FindAuthorsQuery()
    return await this.queryBus.execute(query)
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo autor' })
  @ApiBody({
    description: 'Datos necesarios para crear un nuevo autor',
    type: SaveAuthorSwaggerDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Autor creado exitosamente',
    schema: {
      example: {
        message: 'Autor creado con exito',
        author: {
          id: '1faa4614-f0ff-4d25-8d81-50345619f544',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error al crear el autor',
    schema: {
      example: {
        statusCode: 400,
        message: 'El nombre del autor es requerido',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'El autor ya existe',
    schema: {
      example: {
        statusCode: 409,
        message: 'Este autor ya existe',
        error: 'Conflict',
      },
    },
  })
  @UsePipes(new ZodValidationPipe(saveAuthorSchema))
  async createAuthor(@Body() saveAuthorDto: SaveAuthorDto) {
    const command = new SaveAuthorCommand(saveAuthorDto)
    return await this.commandBus.execute(command)
  }
}
