import { NotFoundException } from '@nestjs/common'

export class MangaNotFoundException extends NotFoundException {
  constructor() {
    super({
      message: 'No se encontró el manga',
      error: 'MangaNotFoundException',
    })
  }
}
