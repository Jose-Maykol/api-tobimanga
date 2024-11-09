import { Injectable } from '@nestjs/common'

@Injectable()
export class MangaService {
  constructor() {}

  async findPaginatedMangas(page: number, limit: number): Promise<any> {
    return { page, limit }
  }
}
