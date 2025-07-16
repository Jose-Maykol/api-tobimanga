import { v4 as uuidv4 } from 'uuid'
import slugify from 'slugify'
import { Manga } from '../entities/manga.entity'

export class MangaFactory {
  constructor() {}

  public create(
    props: Omit<
      Manga,
      | 'id'
      | 'slugName'
      | 'scrappingName'
      | 'rating'
      | 'active'
      | 'createdAt'
      | 'updatedAt'
    >,
  ): Manga {
    const {
      originalName,
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

    const slugName = slugify(originalName, {
      lower: true,
      strict: true,
      locale: 'es',
    })

    return {
      id: uuidv4(),
      originalName,
      slugName: slugName,
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
