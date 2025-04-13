import { IQuery } from '@nestjs/cqrs'

export class FindPaginatedChaptersQuery implements IQuery {
  readonly page: number
  readonly limit: number
  readonly mangaId: string

  constructor(mangaId: string, pagination: { page: number; limit: number }) {
    this.mangaId = mangaId
    this.page = Number(pagination.page)
    this.limit = Number(pagination.limit)
  }
}
