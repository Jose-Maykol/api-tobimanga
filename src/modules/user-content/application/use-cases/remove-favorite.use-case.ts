import { Inject, Injectable } from '@nestjs/common'

import { UserManga } from '../../domain/entities/user-manga.entity'
import { MangaNotFollowedException } from '../../domain/exceptions/manga-not-followed.exception'
import { IUserContentRepository } from '../../domain/repositories/user-content.repository'
import { USER_CONTENT_REPOSITORY } from '../../domain/tokens'

export interface RemoveFavoriteUseCaseParams {
  userId: string
  mangaId: string
}

@Injectable()
export class RemoveFavoriteUseCase {
  constructor(
    @Inject(USER_CONTENT_REPOSITORY)
    private readonly userContentRepository: IUserContentRepository,
  ) {}

  async execute({
    userId,
    mangaId,
  }: RemoveFavoriteUseCaseParams): Promise<UserManga> {
    const userManga = await this.userContentRepository.findByUserAndManga(
      userId,
      mangaId,
    )

    if (!userManga) {
      throw new MangaNotFollowedException(mangaId)
    }

    if (!userManga.isFavorite) {
      return userManga
    }

    userManga.isFavorite = false
    userManga.updatedAt = new Date()

    return await this.userContentRepository.update(userManga)
  }
}
