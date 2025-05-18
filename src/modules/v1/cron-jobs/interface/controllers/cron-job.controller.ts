import { Controller, Post, Body, HttpStatus, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import {
  CreateCronJobDto,
  CreateCronJobSwaggerDto,
} from '../dto/create-cron-job.dto'
import { CreateCronJobCommand } from '../../application/commands/create-cron-job/create-cron-job.command'
import { GetCronJobsQuery } from '../../application/queries/get-cron-jobs/get-cron-jobs.query'

@Controller()
export class CronJobController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @ApiOperation({
    summary: 'Crear un nuevo cron job',
    description:
      'Permite crear un nuevo trabajo programado con los parámetros especificados',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'El trabajo programado ha sido creado exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  @ApiBody({
    type: () => CreateCronJobSwaggerDto,
    description: 'Datos para crear un nuevo trabajo programado',
    examples: {
      ejemplo: {
        value: {
          name: 'Mi trabajo programado',
          schedule: '0 0 * * *',
          task: 'mi-tarea',
          isActive: true,
        },
      },
    },
  })
  @Post()
  async create(@Body() dto: CreateCronJobDto) {
    const command = new CreateCronJobCommand({
      name: dto.name,
      schedule: dto.schedule,
      task: dto.task,
      isActive: dto.isActive ?? true,
    })

    return await this.commandBus.execute(command)
  }

  @Get()
  async getCronJobs() {
    return this.queryBus.execute(new GetCronJobsQuery())
  }

  /* @Get(':id')
  async getById(@Param('id') id: string) {
    return this.queryBus.execute(new GetCronJobByIdQuery(id))
  } */
}
