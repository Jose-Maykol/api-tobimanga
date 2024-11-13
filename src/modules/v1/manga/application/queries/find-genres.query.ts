import { IQuery } from '@nestjs/cqrs'

export class FindGenresQuery implements IQuery {
  constructor() {
    Object.assign(this)
  }
}
