import { Inject, Injectable } from '@nestjs/common'

import { ChapterProgressNotFoundException } from '../../domain/exceptions/chapter-progress-not-found.exception'
import { IUserContentRepository } from '../../domain/repositories/user-content.repository'
import { USER_CONTENT_REPOSITORY } from '../../domain/tokens'

@Injectable()
export class UnmarkChapterAsReadUseCase {
  constructor(
    @Inject(USER_CONTENT_REPOSITORY)
    private readonly userContentRepository: IUserContentRepository,
  ) {}

  async execute(params: { userId: string; chapterId: string }): Promise<void> {
    const { userId, chapterId } = params

    const existing = await this.userContentRepository.findChapterProgress(
      userId,
      chapterId,
    )

    if (!existing) {
      throw new ChapterProgressNotFoundException(chapterId)
    }

    await this.userContentRepository.deleteChapterProgress(userId, chapterId)
  }
}
