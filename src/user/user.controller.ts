import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { UserService } from './user.service'
import { Request } from 'express'
import { Payload } from '@/shared/payload.interface'
import { AddMangaDto } from './dto/add-manga.dto'

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
  async addManga(
    @Body() addManga: AddMangaDto,
    @Req() req: Request,
  ): Promise<{ message: string; manga?: { id: string } }> {
    const user: Payload = req['user']
    const alreadyAdded = await this.userService.alreadyAdded(
      user.sub,
      addManga.mangaId,
    )

    if (alreadyAdded) {
      return {
        message: 'Este manga ya ha sido añadido',
      }
    }

    const manga = await this.userService.addManga(user.sub, addManga.mangaId)
    console.log(manga)
    return {
      message: 'Manga añadido',
      manga: {
        id: manga.id,
      },
    }
  }
}
