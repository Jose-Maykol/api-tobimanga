import { Injectable } from '@nestjs/common'

@Injectable()
export class UnmarkChapterReadUseCase {
  constructor() {}

  async execute(mangaId: string, chapterId: string, userId: string) {
    // Logic to unmark the chapter as read for the user
  }
}
