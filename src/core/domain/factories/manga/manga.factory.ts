import { v4 as uuidv4 } from 'uuid'

import { Manga } from '../../entities/manga.entity'

export class MangaFactory {
  constructor() {}

  public create(
    props: Omit<
      Manga,
      'id' | 'scrappingName' | 'rating' | 'active' | 'createdAt' | 'updatedAt'
    >,
  ): Manga {
    const {
      originalName,
      slugName,
      alternativeNames,
      sinopsis,
      chapters,
      releaseDate,
      coverImage,
      bannerImage,
      publicationStatus,
      authors,
      genres,
      demographic,
    } = props

    return {
      id: uuidv4(),
      originalName,
      slugName,
      scrappingName: originalName.toLowerCase(),
      alternativeNames: alternativeNames,
      sinopsis,
      chapters,
      releaseDate,
      coverImage,
      bannerImage,
      publicationStatus,
      rating: 0,
      active: true,
      authors,
      genres,
      demographic,
      createdAt: new Date(),
      updatedAt: null,
    }
  }
}
