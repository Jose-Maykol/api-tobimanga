import { NotFoundException } from '@nestjs/common'

export class MangaNotFoundException extends NotFoundException {
  constructor() {
    super({
      code: 'MANGA_NOT_FOUND',
      message: 'No se encontró el manga',
    })
  }
}
