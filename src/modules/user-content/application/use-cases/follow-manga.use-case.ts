import { Inject, Injectable } from '@nestjs/common'

import { UserManga } from '../../domain/entities/user-manga.entity'
import { ReadingStatus } from '../../domain/value-objects/reading-status.vo'
import { IUserContentRepository } from '../../domain/repositories/user-content.repository'
import { USER_CONTENT_REPOSITORY } from '../../domain/tokens'

export interface FollowMangaUseCaseParams {
  userId: string
  mangaId: string
  initialStatus?: ReadingStatus
}

@Injectable()
export class FollowMangaUseCase {
  constructor(
    @Inject(USER_CONTENT_REPOSITORY)
    private readonly userContentRepository: IUserContentRepository,
  ) { }

  async execute({
    userId,
    mangaId,
    initialStatus,
  }: FollowMangaUseCaseParams): Promise<UserManga> {
    // Check if user is already following this manga
    const existingUserManga =
      await this.userContentRepository.findByUserAndManga(userId, mangaId)

    // If already following, return existing record (idempotent)
    if (existingUserManga) {
      return existingUserManga
    }

    // Create new user-manga relationship
    const newUserManga: Omit<UserManga, 'id'> = {
      userId,
      mangaId,
      readingStatus: initialStatus ?? ReadingStatus.PLANNING_TO_READ,
      isFavorite: false,
      rating: null,
      createdAt: new Date(),
      updatedAt: null,
    }

    return await this.userContentRepository.save(newUserManga)
  }
}
