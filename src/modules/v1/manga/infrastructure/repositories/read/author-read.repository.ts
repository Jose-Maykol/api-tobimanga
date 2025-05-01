import { authors } from '@/modules/database/schemas/author.schema'
import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { Injectable } from '@nestjs/common'
import { AuthorListDto } from '../../../application/dto/author.dto'

@Injectable()
export class AuthorReadRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll(): Promise<AuthorListDto[]> {
    const allAuthors = await this.drizzle.db
      .select({
        id: authors.id,
        name: authors.name,
      })
      .from(authors)
    return allAuthors
  }
}
