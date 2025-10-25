import { Injectable } from '@nestjs/common'

@Injectable()
export class MarkChapterReadUseCase {
  constructor() {}

  async execute(mangaId: string, chapterId: string, userId: string) {
    // Logic to mark the chapter as read for the user
  }
}
