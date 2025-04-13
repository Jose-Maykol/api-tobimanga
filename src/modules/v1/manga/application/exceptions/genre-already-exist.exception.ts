import { ConflictException } from '@nestjs/common'

export class GenreAlreadyExistsException extends ConflictException {
  constructor() {
    super({
      code: 'GENRE_ALREADY_EXISTS',
      message: 'Este genero ya existe',
    })
  }
}
