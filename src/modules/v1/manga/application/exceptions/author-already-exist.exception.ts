import { ConflictException } from '@nestjs/common'

export class AuthorAlreadyExistsException extends ConflictException {
  constructor() {
    super({
      code: 'AUTHOR_ALREADY_EXISTS',
      message: `Este autor ya existe`,
    })
  }
}
