import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ROLES } from '@/common/constants/roles.const'
import { AuthenticatedUser } from '@/common/interfaces/authenticated-user.interface'
import { ResponseBuilder } from '@/common/utils/response.util'
import { Roles } from '@/modules/auth/interface/decorators/roles.decorator'
import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'
import { RolesGuard } from '@/modules/auth/interface/guards/roles.guard'

import { ListUsersDto } from '../../application/dtos/list-users.dto'
import { ActivateUserUseCase } from '../../application/use-cases/activate-user.use-case'
import { DeactivateUserUseCase } from '../../application/use-cases/deactivate-user.use-case'
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case'
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case'
import { CannotModifySelfException } from '../../domain/exceptions/cannot-modify-self.exception'
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception'
import { UserManagementSwagger } from '../swagger/user-management.swagger'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN)
@Controller()
@ApiTags('Gestión de Usuarios')
@ApiBearerAuth()
export class UserManagementController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly deactivateUserUseCase: DeactivateUserUseCase,
    private readonly activateUserUseCase: ActivateUserUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar usuarios',
    description:
      'Obtiene una lista paginada de usuarios. Se puede filtrar por estado (activo/inactivo). Solo accesible por usuarios ADMIN.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Página (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Ítems por página (default: 20, max: 100)',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filtrar por estado activo/inactivo',
  })
  @ApiResponse(UserManagementSwagger.listUsers.responses.ok)
  async listUsers(@Query() dto: ListUsersDto) {
    const { items, meta } = await this.listUsersUseCase.execute(dto)

    return ResponseBuilder.success({
      message: 'Usuarios obtenidos exitosamente',
      data: items,
      meta,
    })
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener usuario por ID',
    description:
      'Obtiene los datos de un usuario por su ID. Solo accesible por usuarios ADMIN.',
  })
  @ApiParam(UserManagementSwagger.getById.param)
  @ApiResponse(UserManagementSwagger.getById.responses.ok)
  @ApiResponse(UserManagementSwagger.getById.responses.notFound)
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.getUserByIdUseCase.execute(id)

      return ResponseBuilder.success({
        message: 'Usuario obtenido exitosamente',
        data: user,
      })
    } catch (error) {
      if (error instanceof UserNotFoundException) {
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

  @Patch(':id/deactivate')
  @ApiOperation({
    summary: 'Desactivar usuario',
    description:
      'Desactiva la cuenta de un usuario. Por regla de negocio, un administrador no puede desactivar su propia cuenta. Solo accesible por usuarios ADMIN.',
  })
  @ApiParam(UserManagementSwagger.deactivate.param)
  @ApiResponse(UserManagementSwagger.deactivate.responses.ok)
  @ApiResponse(UserManagementSwagger.deactivate.responses.notFound)
  @ApiResponse(UserManagementSwagger.deactivate.responses.forbidden)
  async deactivateUser(
    @Param('id') id: string,
    @Request() req: { user: AuthenticatedUser },
  ) {
    try {
      const updated = await this.deactivateUserUseCase.execute(id, req.user.id)

      return ResponseBuilder.success({
        message: 'Usuario desactivado exitosamente',
        data: updated,
      })
    } catch (error) {
      if (error instanceof CannotModifySelfException) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            error.code,
            HttpStatus.FORBIDDEN,
          ),
          HttpStatus.FORBIDDEN,
        )
      }
      if (error instanceof UserNotFoundException) {
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

  @Patch(':id/activate')
  @ApiOperation({
    summary: 'Activar usuario',
    description:
      'Activa la cuenta de un usuario. Por regla de negocio, un administrador no puede modificar su propia cuenta. Solo accesible por usuarios ADMIN.',
  })
  @ApiParam(UserManagementSwagger.activate.param)
  @ApiResponse(UserManagementSwagger.activate.responses.ok)
  @ApiResponse(UserManagementSwagger.activate.responses.notFound)
  @ApiResponse(UserManagementSwagger.activate.responses.forbidden)
  async activateUser(
    @Param('id') id: string,
    @Request() req: { user: AuthenticatedUser },
  ) {
    try {
      const updated = await this.activateUserUseCase.execute(id, req.user.id)

      return ResponseBuilder.success({
        message: 'Usuario activado exitosamente',
        data: updated,
      })
    } catch (error) {
      if (error instanceof CannotModifySelfException) {
        throw new HttpException(
          ResponseBuilder.error(
            error.message,
            error.code,
            HttpStatus.FORBIDDEN,
          ),
          HttpStatus.FORBIDDEN,
        )
      }
      if (error instanceof UserNotFoundException) {
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
