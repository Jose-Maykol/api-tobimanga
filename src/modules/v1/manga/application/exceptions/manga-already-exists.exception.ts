import { ConflictException } from '@nestjs/common'

export class MangaAlreadyExistsException extends ConflictException {
  constructor() {
    super({
      code: 'MANGA_ALREADY_EXISTS',
      message: 'Este manga ya existe',
    })
  }
}
