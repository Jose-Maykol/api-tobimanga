import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
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

import { AuthenticatedUser } from '@/common/interfaces/authenticated-user.interface'
import { ResponseBuilder } from '@/common/utils/response.util'
import { User } from '@/modules/auth/interface/decorators/user.decorator'
import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'

import { FollowMangaDto } from '../../application/dtos/follow-manga.dto'
import { UpdateReadingStatusDto } from '../../application/dtos/update-reading-status.dto'
import { AddFavoriteUseCase } from '../../application/use-cases/add-favorite.use-case'
import { FollowMangaUseCase } from '../../application/use-cases/follow-manga.use-case'
import { GetUserFavoritesUseCase } from '../../application/use-cases/get-user-favorites.use-case'
import { GetUserMangaBySlugUseCase } from '../../application/use-cases/get-user-manga-by-slug.use-case'
import { ListChaptersByMangaSlugUseCase } from '../../application/use-cases/list-chapters-by-manga-slug.use-case'
import { MarkChapterAsReadUseCase } from '../../application/use-cases/mark-chapter-as-read.use-case'
import { RemoveFavoriteUseCase } from '../../application/use-cases/remove-favorite.use-case'
import { UnmarkChapterAsReadUseCase } from '../../application/use-cases/unmark-chapter-as-read.use-case'
import { UpdateReadingStatusUseCase } from '../../application/use-cases/update-reading-status.use-case'
import { ChapterProgressNotFoundException } from '../../domain/exceptions/chapter-progress-not-found.exception'
import { MangaNotFollowedException } from '../../domain/exceptions/manga-not-followed.exception'
import { UserContentSwagger } from '../swagger/user-content.swagger'

@ApiTags('Contenido de Usuario')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user/mangas')
export class UserContentController {
  constructor(
    private readonly followMangaUseCase: FollowMangaUseCase,
    private readonly updateReadingStatusUseCase: UpdateReadingStatusUseCase,
    private readonly addFavoriteUseCase: AddFavoriteUseCase,
    private readonly removeFavoriteUseCase: RemoveFavoriteUseCase,
    private readonly getUserFavoritesUseCase: GetUserFavoritesUseCase,
    private readonly getUserMangaBySlugUseCase: GetUserMangaBySlugUseCase,
    private readonly listChaptersByMangaSlugUseCase: ListChaptersByMangaSlugUseCase,
    private readonly markChapterAsReadUseCase: MarkChapterAsReadUseCase,
    private readonly unmarkChapterAsReadUseCase: UnmarkChapterAsReadUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Seguir un manga',
    description:
      'Permite a un usuario autenticado seguir un manga e indicar su estado de lectura inicial.',
  })
  @ApiBody(UserContentSwagger.followManga.body)
  @ApiResponse(UserContentSwagger.followManga.responses.created)
  @ApiResponse(UserContentSwagger.followManga.responses.badRequest)
  async followManga(
    @User() user: AuthenticatedUser,
    @Body() followMangaDto: FollowMangaDto,
  ) {
    const result = await this.followMangaUseCase.execute({
      userId: user.id,
      mangaId: followMangaDto.mangaId,
      initialStatus: followMangaDto.initialStatus,
    })

    return ResponseBuilder.success({
      message: 'Manga seguido exitosamente',
      data: {
        userManga: result,
      },
    })
  }

  @Patch(':mangaId/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar estado de lectura',
    description:
      'Actualiza el estado de lectura de un manga que el usuario ya sigue.',
  })
  @ApiParam(UserContentSwagger.updateReadingStatus.param)
  @ApiBody(UserContentSwagger.updateReadingStatus.body)
  @ApiResponse(UserContentSwagger.updateReadingStatus.responses.success)
  @ApiResponse(UserContentSwagger.updateReadingStatus.responses.notFound)
  @ApiResponse(UserContentSwagger.updateReadingStatus.responses.badRequest)
  async updateReadingStatus(
    @User() user: AuthenticatedUser,
    @Param('mangaId') mangaId: string,
    @Body() updateReadingStatusDto: UpdateReadingStatusDto,
  ) {
    try {
      const result = await this.updateReadingStatusUseCase.execute({
        userId: user.id,
        mangaId,
        newStatus: updateReadingStatusDto.status,
      })

      return ResponseBuilder.success({
        message: 'Estado de lectura actualizado exitosamente',
        data: {
          userManga: result,
        },
      })
    } catch (error) {
      if (error instanceof MangaNotFollowedException) {
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

  @Post(':mangaId/favorite')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Marcar como favorito',
    description: 'Marca un manga que el usuario sigue como favorito.',
  })
  @ApiParam(UserContentSwagger.addFavorite.param)
  @ApiResponse(UserContentSwagger.addFavorite.responses.created)
  @ApiResponse(UserContentSwagger.addFavorite.responses.notFound)
  async addFavorite(
    @User() user: AuthenticatedUser,
    @Param('mangaId') mangaId: string,
  ) {
    try {
      const result = await this.addFavoriteUseCase.execute({
        userId: user.id,
        mangaId,
      })

      return ResponseBuilder.success({
        message: 'Manga marcado como favorito exitosamente',
        data: {
          userManga: result,
        },
      })
    } catch (error) {
      if (error instanceof MangaNotFollowedException) {
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

  @Delete(':mangaId/favorite')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Desmarcar como favorito',
    description: 'Desmarca un manga que el usuario sigue como favorito.',
  })
  @ApiParam(UserContentSwagger.removeFavorite.param)
  @ApiResponse(UserContentSwagger.removeFavorite.responses.success)
  @ApiResponse(UserContentSwagger.removeFavorite.responses.notFound)
  async removeFavorite(
    @User() user: AuthenticatedUser,
    @Param('mangaId') mangaId: string,
  ) {
    try {
      const result = await this.removeFavoriteUseCase.execute({
        userId: user.id,
        mangaId,
      })

      return ResponseBuilder.success({
        message: 'Manga desmarcado como favorito exitosamente',
        data: {
          userManga: result,
        },
      })
    } catch (error) {
      if (error instanceof MangaNotFollowedException) {
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

  @Get('favorites')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener mangas favoritos del usuario',
    description:
      'Retorna una lista paginada de mangas marcados como favoritos con información completa del manga.',
  })
  @ApiQuery(UserContentSwagger.getUserFavorites.queries.page)
  @ApiQuery(UserContentSwagger.getUserFavorites.queries.pageSize)
  @ApiQuery(UserContentSwagger.getUserFavorites.queries.sortBy)
  @ApiQuery(UserContentSwagger.getUserFavorites.queries.sortOrder)
  @ApiResponse(UserContentSwagger.getUserFavorites.responses.success)
  async getUserFavorites(
    @User() user: AuthenticatedUser,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('sortBy') sortBy?: 'favoritedAt' | 'title' | 'rating',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    const result = await this.getUserFavoritesUseCase.execute({
      userId: user.id,
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
      sortBy,
      sortOrder,
    })

    return ResponseBuilder.success({
      message: 'Favoritos obtenidos exitosamente',
      data: result,
    })
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener detalle de manga para usuario',
    description:
      'Retorna el detalle de un manga incluyendo el estado de seguimiento del usuario (favorito, estado de lectura, rating).',
  })
  @ApiParam(UserContentSwagger.getUserMangaBySlug.param)
  @ApiResponse(UserContentSwagger.getUserMangaBySlug.responses.success)
  @ApiResponse(UserContentSwagger.getUserMangaBySlug.responses.notFound)
  async getUserMangaBySlug(
    @User() user: AuthenticatedUser,
    @Param('slug') slug: string,
  ) {
    const result = await this.getUserMangaBySlugUseCase.execute(user.id, slug)

    return ResponseBuilder.success({
      message: 'Detalle del manga obtenido exitosamente',
      data: result,
    })
  }

  @Get(':slug/chapters')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar capítulos de un manga con estado de lectura',
    description:
      'Retorna la lista de capítulos incluyendo si han sido leídos por el usuario.',
  })
  @ApiParam(UserContentSwagger.getUserMangaBySlug.param) // Reusing slug param doc
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  async listChapters(
    @User() user: AuthenticatedUser,
    @Param('slug') slug: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('order') order?: 'ASC' | 'DESC',
  ) {
    const result = await this.listChaptersByMangaSlugUseCase.execute(
      user.id,
      slug,
      {
        page,
        limit,
        order,
      },
    )

    return ResponseBuilder.success({
      message: 'Capítulos listados exitosamente',
      data: result,
    })
  }

  @Post('chapters/:chapterId/read')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Marcar capítulo como leído',
    description:
      'Registra que el usuario ha leído un capítulo específico. ' +
      'Si el registro ya existe es idempotente (devuelve el existente).',
  })
  @ApiParam(UserContentSwagger.markChapterAsRead.param)
  @ApiResponse(UserContentSwagger.markChapterAsRead.responses.created)
  async markChapterAsRead(
    @User() user: AuthenticatedUser,
    @Param('chapterId') chapterId: string,
  ) {
    const progress = await this.markChapterAsReadUseCase.execute({
      userId: user.id,
      chapterId,
    })

    return ResponseBuilder.success({
      message: 'Capítulo marcado como leído exitosamente',
      data: { progress },
    })
  }

  @Delete('chapters/:chapterId/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Desmarcar capítulo como leído',
    description:
      'Elimina el registro de lectura de un capítulo para el usuario autenticado.',
  })
  @ApiParam(UserContentSwagger.unmarkChapterAsRead.param)
  @ApiResponse(UserContentSwagger.unmarkChapterAsRead.responses.success)
  @ApiResponse(UserContentSwagger.unmarkChapterAsRead.responses.notFound)
  async unmarkChapterAsRead(
    @User() user: AuthenticatedUser,
    @Param('chapterId') chapterId: string,
  ) {
    try {
      await this.unmarkChapterAsReadUseCase.execute({
        userId: user.id,
        chapterId,
      })

      return ResponseBuilder.success({
        message: 'Registro de lectura eliminado exitosamente',
        data: null,
      })
    } catch (error) {
      if (error instanceof ChapterProgressNotFoundException) {
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
