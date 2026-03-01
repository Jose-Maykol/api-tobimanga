import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ROLES } from '@/common/constants/roles.const'
import { ResponseBuilder } from '@/common/utils/response.util'
import { Roles } from '@/modules/auth/interface/decorators/roles.decorator'
import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'
import { RolesGuard } from '@/modules/auth/interface/guards/roles.guard'

import { CreateCronJobDto } from '../../application/dtos/create-cron-job.dto'
import { UpdateCronJobDto } from '../../application/dtos/update-cron-job.dto'
import { CreateCronJobUseCase } from '../../application/use-cases/create-cron-job.use-case'
import { DeleteCronJobUseCase } from '../../application/use-cases/delete-cron-job.use-case'
import { GetAllCronJobsUseCase } from '../../application/use-cases/get-all-cron-jobs.use-case'
import { GetCronJobByIdUseCase } from '../../application/use-cases/get-cron-job-by-id.use-case'
import { GetCronJobExecutionsUseCase } from '../../application/use-cases/get-cron-job-executions.use-case'
import { GetCronJobProcessesUseCase } from '../../application/use-cases/get-cron-job-processes.use-case'
import { ToggleCronJobUseCase } from '../../application/use-cases/toggle-cron-job.use-case'
import { UpdateCronJobUseCase } from '../../application/use-cases/update-cron-job.use-case'
import { CronJobAlreadyExistsException } from '../../domain/exceptions/cron-job-already-exists.exception'
import { CronJobNotFoundException } from '../../domain/exceptions/cron-job-not-found.exception'
import { CronJobManagementSwagger } from '../swagger/cron-job-management.swagger'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN)
@Controller()
@ApiTags('Gestión de Cron Jobs')
export class CronJobManagementController {
  constructor(
    private readonly createCronJobUseCase: CreateCronJobUseCase,
    private readonly getAllCronJobsUseCase: GetAllCronJobsUseCase,
    private readonly getCronJobByIdUseCase: GetCronJobByIdUseCase,
    private readonly updateCronJobUseCase: UpdateCronJobUseCase,
    private readonly deleteCronJobUseCase: DeleteCronJobUseCase,
    private readonly toggleCronJobUseCase: ToggleCronJobUseCase,
    private readonly getCronJobExecutionsUseCase: GetCronJobExecutionsUseCase,
    private readonly getCronJobProcessesUseCase: GetCronJobProcessesUseCase,
  ) {}

  @Get('processes')
  @ApiOperation({
    summary: 'Obtener procesos disponibles',
    description:
      'Retorna el catálogo de procesos registrados en el sistema que pueden ser programados como cron jobs.',
  })
  @ApiResponse(CronJobManagementSwagger.getProcesses.responses.ok)
  @ApiBearerAuth()
  getProcesses() {
    const processes = this.getCronJobProcessesUseCase.execute()
    return ResponseBuilder.success({
      message: 'Procesos disponibles obtenidos exitosamente',
      data: processes,
    })
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo cron job',
    description:
      'Crea un nuevo cron job para ejecución periódica. Solo accesible por usuarios ADMIN.',
  })
  @ApiBody(CronJobManagementSwagger.create.body)
  @ApiResponse(CronJobManagementSwagger.create.responses.created)
  @ApiResponse(CronJobManagementSwagger.create.responses.conflict)
  @ApiResponse(CronJobManagementSwagger.create.responses.badRequest)
  @ApiBearerAuth()
  async create(@Body() dto: CreateCronJobDto) {
    try {
      const result = await this.createCronJobUseCase.execute(dto)

      return ResponseBuilder.success({
        message: 'Cron job creado exitosamente',
        data: result,
      })
    } catch (error) {
      if (error instanceof CronJobAlreadyExistsException) {
        throw new HttpException(
          ResponseBuilder.error(error.message, error.code, HttpStatus.CONFLICT),
          HttpStatus.CONFLICT,
        )
      }
      if (error.message?.includes('no es válida')) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            'CRON_JOB_INVALID_SCHEDULE',
            HttpStatus.BAD_REQUEST,
          ),
          HttpStatus.BAD_REQUEST,
        )
      }
      throw error
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los cron jobs',
    description: 'Obtiene la lista de todos los cron jobs configurados.',
  })
  @ApiResponse(CronJobManagementSwagger.getAll.responses.ok)
  @ApiBearerAuth()
  async getAll() {
    const cronJobs = await this.getAllCronJobsUseCase.execute()
    return ResponseBuilder.success({
      message: 'Cron jobs obtenidos exitosamente',
      data: cronJobs,
    })
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un cron job por ID',
    description: 'Obtiene los detalles de un cron job específico.',
  })
  @ApiParam(CronJobManagementSwagger.getById.param)
  @ApiResponse(CronJobManagementSwagger.getById.responses.ok)
  @ApiResponse(CronJobManagementSwagger.getById.responses.notFound)
  @ApiBearerAuth()
  async getById(@Param('id') id: string) {
    try {
      const cronJob = await this.getCronJobByIdUseCase.execute(id)
      return ResponseBuilder.success({
        message: 'Cron job obtenido exitosamente',
        data: cronJob,
      })
    } catch (error) {
      if (error instanceof CronJobNotFoundException) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            error.code,
            HttpStatus.NOT_FOUND,
          ),
          HttpStatus.NOT_FOUND,
        )
      }
      throw error
    }
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un cron job',
    description:
      'Actualiza un cron job existente. Solo accesible por usuarios ADMIN.',
  })
  @ApiParam(CronJobManagementSwagger.update.param)
  @ApiBody(CronJobManagementSwagger.update.body)
  @ApiResponse(CronJobManagementSwagger.update.responses.success)
  @ApiResponse(CronJobManagementSwagger.update.responses.notFound)
  @ApiResponse(CronJobManagementSwagger.update.responses.badRequest)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() dto: UpdateCronJobDto) {
    try {
      const result = await this.updateCronJobUseCase.execute(id, dto)

      return ResponseBuilder.success({
        message: 'Cron job actualizado exitosamente',
        data: result,
      })
    } catch (error) {
      if (error instanceof CronJobNotFoundException) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            error.code,
            HttpStatus.NOT_FOUND,
          ),
          HttpStatus.NOT_FOUND,
        )
      }
      if (error.message?.includes('no es válida')) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            'CRON_JOB_INVALID_SCHEDULE',
            HttpStatus.BAD_REQUEST,
          ),
          HttpStatus.BAD_REQUEST,
        )
      }
      throw error
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un cron job',
    description:
      'Elimina un cron job existente. Solo accesible por usuarios ADMIN.',
  })
  @ApiParam(CronJobManagementSwagger.delete.param)
  @ApiResponse(CronJobManagementSwagger.delete.responses.success)
  @ApiResponse(CronJobManagementSwagger.delete.responses.notFound)
  @ApiBearerAuth()
  async delete(@Param('id') id: string) {
    try {
      await this.deleteCronJobUseCase.execute(id)
      return ResponseBuilder.success({
        message: 'Cron job eliminado exitosamente',
        data: null,
      })
    } catch (error) {
      if (error instanceof CronJobNotFoundException) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            error.code,
            HttpStatus.NOT_FOUND,
          ),
          HttpStatus.NOT_FOUND,
        )
      }
      throw error
    }
  }

  @Patch(':id/toggle')
  @ApiOperation({
    summary: 'Activar/Desactivar un cron job',
    description:
      'Cambia el estado activo/inactivo de un cron job. Solo accesible por usuarios ADMIN.',
  })
  @ApiParam(CronJobManagementSwagger.toggle.param)
  @ApiResponse(CronJobManagementSwagger.toggle.responses.success)
  @ApiResponse(CronJobManagementSwagger.toggle.responses.notFound)
  @ApiBearerAuth()
  async toggle(@Param('id') id: string) {
    try {
      const result = await this.toggleCronJobUseCase.execute(id)

      return ResponseBuilder.success({
        message: result.isActive
          ? 'Cron job activado exitosamente'
          : 'Cron job desactivado exitosamente',
        data: result,
      })
    } catch (error) {
      if (error instanceof CronJobNotFoundException) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            error.code,
            HttpStatus.NOT_FOUND,
          ),
          HttpStatus.NOT_FOUND,
        )
      }
      throw error
    }
  }

  @Get(':id/executions')
  @ApiOperation({
    summary: 'Obtener ejecuciones de un cron job',
    description:
      'Obtiene el historial de ejecuciones de un cron job específico.',
  })
  @ApiParam(CronJobManagementSwagger.executions.param)
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de ejecuciones a retornar (default: 20)',
    example: 20,
  })
  @ApiResponse(CronJobManagementSwagger.executions.responses.ok)
  @ApiResponse(CronJobManagementSwagger.executions.responses.notFound)
  @ApiBearerAuth()
  async getExecutions(@Param('id') id: string, @Query('limit') limit?: number) {
    try {
      const executions = await this.getCronJobExecutionsUseCase.execute(
        id,
        limit ? Number(limit) : undefined,
      )

      return ResponseBuilder.success({
        message: 'Ejecuciones obtenidas exitosamente',
        data: executions,
      })
    } catch (error) {
      if (error instanceof CronJobNotFoundException) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            error.code,
            HttpStatus.NOT_FOUND,
          ),
          HttpStatus.NOT_FOUND,
        )
      }
      throw error
    }
  }
}
