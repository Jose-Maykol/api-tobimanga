import { NotFoundException } from '@nestjs/common'

export class AuthorNotFoundException extends NotFoundException {
  constructor() {
    super({
      code: 'AUTHOR_NOT_FOUND',
      message: 'No se encontraron autores',
    })
  }
}
