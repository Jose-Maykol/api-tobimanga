import { NotFoundException } from '@nestjs/common'

export class GenreNotFoundException extends NotFoundException {
  constructor() {
    super(`No se encontraron géneros`)
  }
}
