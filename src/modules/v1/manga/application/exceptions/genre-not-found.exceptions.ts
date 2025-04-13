import { NotFoundException } from '@nestjs/common'

export class GenreNotFoundException extends NotFoundException {
  constructor() {
    super({
      code: 'GENRE_NOT_FOUND',
      message: 'No se encontraron géneros',
    })
  }
}
