import { IQuery } from '@nestjs/cqrs'

export class FindPaginatedAdminMangasQuery implements IQuery {
  readonly page: number
  readonly limit: number

  constructor(pagination: { page: number; limit: number }) {
    this.page = Number(pagination.page)
    this.limit = Number(pagination.limit)
  }
}
