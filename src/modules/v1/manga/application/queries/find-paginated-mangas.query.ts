import { IQuery } from '@nestjs/cqrs'

export class FindPaginatedMangasQuery implements IQuery {
  readonly page: number
  readonly limit: number

  constructor(pagination: { page: number; limit: number }) {
    Object.assign(this, pagination)
  }
}
