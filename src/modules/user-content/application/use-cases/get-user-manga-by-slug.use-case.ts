import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import { UserMangaDetailReadModel } from '../../domain/read-models/user-manga-detail.read-model'
import { IUserContentQueryRepository } from '../../domain/repositories/user-content-query.repository'
import { USER_CONTENT_QUERY_REPOSITORY } from '../../domain/tokens'

@Injectable()
export class GetUserMangaBySlugUseCase {
  constructor(
    @Inject(USER_CONTENT_QUERY_REPOSITORY)
    private readonly userContentQueryRepository: IUserContentQueryRepository,
  ) {}

  async execute(
    userId: string,
    slug: string,
  ): Promise<UserMangaDetailReadModel> {
    const userManga =
      await this.userContentQueryRepository.findUserMangaDetailBySlug(
        userId,
        slug,
      )

    if (!userManga) {
      throw new NotFoundException(`Manga not found for slug: ${slug}`)
    }

    return userManga
  }
}
