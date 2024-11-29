import { IQuery } from '@nestjs/cqrs'

export class FindPaginatedChaptersQuery implements IQuery {
  readonly page: number
  readonly limit: number
  readonly slug: string

  constructor(slug: string, pagination: { page: number; limit: number }) {
    this.slug = slug
    this.page = pagination.page
    this.limit = pagination.limit
  }
}
