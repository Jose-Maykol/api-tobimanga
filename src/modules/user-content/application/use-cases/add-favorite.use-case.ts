import { Inject, Injectable } from '@nestjs/common'

import { UserManga } from '../../domain/entities/user-manga.entity'
import { MangaNotFollowedException } from '../../domain/exceptions/manga-not-followed.exception'
import { IUserContentRepository } from '../../domain/repositories/user-content.repository'
import { USER_CONTENT_REPOSITORY } from '../../domain/tokens'

export interface AddFavoriteUseCaseParams {
  userId: string
  mangaId: string
}

@Injectable()
export class AddFavoriteUseCase {
  constructor(
    @Inject(USER_CONTENT_REPOSITORY)
    private readonly userContentRepository: IUserContentRepository,
  ) {}

  async execute({
    userId,
    mangaId,
  }: AddFavoriteUseCaseParams): Promise<UserManga> {
    const userManga = await this.userContentRepository.findByUserAndManga(
      userId,
      mangaId,
    )

    if (!userManga) {
      throw new MangaNotFollowedException(mangaId)
    }

    if (userManga.isFavorite) {
      return userManga
    }

    userManga.isFavorite = true
    userManga.updatedAt = new Date()

    return await this.userContentRepository.update(userManga)
  }
}
