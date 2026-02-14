import { Inject, Injectable } from '@nestjs/common'

import { UserManga } from '../../domain/entities/user-manga.entity'
import { MangaNotFollowedException } from '../../domain/exceptions/manga-not-followed.exception'
import { IUserContentRepository } from '../../domain/repositories/user-content.repository'
import { USER_CONTENT_REPOSITORY } from '../../domain/tokens'
import { ReadingStatus } from '../../domain/value-objects/reading-status.vo'

export interface UpdateReadingStatusUseCaseParams {
  userId: string
  mangaId: string
  newStatus: ReadingStatus
}

@Injectable()
export class UpdateReadingStatusUseCase {
  constructor(
    @Inject(USER_CONTENT_REPOSITORY)
    private readonly userContentRepository: IUserContentRepository,
  ) {}

  async execute({
    userId,
    mangaId,
    newStatus,
  }: UpdateReadingStatusUseCaseParams): Promise<UserManga> {
    // Check if user is following this manga
    const userManga = await this.userContentRepository.findByUserAndManga(
      userId,
      mangaId,
    )

    // If not following, throw exception
    if (!userManga) {
      throw new MangaNotFollowedException(mangaId)
    }

    // Update reading status
    userManga.readingStatus = newStatus
    userManga.updatedAt = new Date()

    return await this.userContentRepository.update(userManga)
  }
}
