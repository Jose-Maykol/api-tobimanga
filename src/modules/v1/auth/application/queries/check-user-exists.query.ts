import { IQuery } from '@nestjs/cqrs'

export class CheckUserExistsQuery implements IQuery {
  public readonly id: string
  constructor(id: string) {
    this.id = id
  }
}
