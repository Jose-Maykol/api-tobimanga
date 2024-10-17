import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common'
import { UserService } from './user.service'
import { Request } from 'express'
import { Payload } from '../shared/payload.interface'
import { FollowMangaDto, followMangaSchema } from './dto/follow-manga.dto'
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('mangas')
  async getMangas(@Req() req: Request): Promise<{ mangas: any }> {
    const user: Payload = req['user']
    const mangas = await this.userService.findMangaByUser(user.sub)
    return {
      mangas,
    }
  }

  @Post('mangas')
  @UsePipes(new ZodValidationPipe(followMangaSchema))
  async followManga(
    @Body() followManga: FollowMangaDto,
    @Req() req: Request,
  ): Promise<{ message: string; manga: { id: string } }> {
    const user: Payload = req['user']
    try {
      const manga = await this.userService.followManga(
        user.sub,
        followManga.manga.id,
      )
      return {
        message: 'Manga añadido',
        manga,
      }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
