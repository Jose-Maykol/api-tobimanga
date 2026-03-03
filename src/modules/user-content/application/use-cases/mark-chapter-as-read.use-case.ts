import { Inject, Injectable } from '@nestjs/common'

import { UserChapterProgress } from '../../domain/entities/user-chapter-progress.entity'
import { IUserContentRepository } from '../../domain/repositories/user-content.repository'
import { USER_CONTENT_REPOSITORY } from '../../domain/tokens'

@Injectable()
export class MarkChapterAsReadUseCase {
  constructor(
    @Inject(USER_CONTENT_REPOSITORY)
    private readonly userContentRepository: IUserContentRepository,
  ) {}

  async execute(params: {
    userId: string
    chapterId: string
  }): Promise<UserChapterProgress> {
    const { userId, chapterId } = params

    return this.userContentRepository.saveChapterProgress(userId, chapterId)
  }
}
