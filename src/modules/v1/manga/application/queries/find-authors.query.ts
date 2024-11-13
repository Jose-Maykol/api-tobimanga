import { IQuery } from '@nestjs/cqrs'

export class FindAuthorsQuery implements IQuery {
  constructor() {
    Object.assign(this)
  }
}
