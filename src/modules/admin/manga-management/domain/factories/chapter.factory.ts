import { v4 as uuidv4 } from 'uuid'

import { Chapter } from '../entities/chapter.entity'

interface ChapterFactoryParams {
  mangaId: string
  chapterNumber: number
  title?: string | null
  releaseDate?: Date | null
}

export class ChapterFactory {
  constructor() {}

  public create(props: ChapterFactoryParams): Chapter {
    const { mangaId, chapterNumber, title, releaseDate } = props

    return {
      id: uuidv4(),
      mangaId,
      chapterNumber,
      title: title ?? null,
      releaseDate: releaseDate ?? null,
      createdAt: new Date(),
      updatedAt: null,
    }
  }
}
