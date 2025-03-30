import { IQuery } from "@nestjs/cqrs";


export class FindPaginatedChaptersReadQuery implements IQuery {
  readonly page: number
  readonly limit: number
  readonly mangaId: string
  readonly userId?: string

  constructor(
    mangaId: string,
    pagination: { page: number; limit: number },
    userId: string,
  ) {
    this.mangaId = mangaId
    this.page = Number(pagination.page)
    this.limit = Number(pagination.limit)
    this.userId = userId
  }
}