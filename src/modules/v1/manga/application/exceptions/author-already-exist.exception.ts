import { ConflictException } from '@nestjs/common'

export class AuthorAlreadyExistsException extends ConflictException {
  constructor(authorName: string) {
    super(`El autor ${authorName} ya existe`)
  }
}
