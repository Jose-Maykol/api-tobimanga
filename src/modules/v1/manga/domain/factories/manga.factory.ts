import { Manga } from '../entities/manga.entity'
import MangaRecord from '../types/manga'
import { v4 as uuidv4 } from 'uuid'
import slugify from 'slugify'

type MangaProps = Omit<
  MangaRecord,
  | 'id'
  | 'slugName'
  | 'scrappingName'
  | 'rating'
  | 'active'
  | 'authors'
  | 'genres'
  | 'demographic'
  | 'createdAt'
  | 'updatedAt'
>

export class MangaFactory {
  create(manga: MangaProps): Manga {
    const slugName = slugify(manga.originalName, {
      lower: true,
      strict: true,
      locale: 'es',
    })

    return new Manga({
      id: uuidv4(),
      slugName: slugName,
      scrappingName: manga.originalName, // TODO: Implement scrapping name
      rating: 0,
      active: true,
      createdAt: new Date(),
      updatedAt: null,
      originalName: manga.originalName,
      alternativeNames: manga.alternativeNames,
      sinopsis: manga.sinopsis,
      chapters: manga.chapters,
      releaseDate: manga.releaseDate,
      publicationStatus: manga.publicationStatus,
      coverImage: manga.coverImage,
      bannerImage: manga.bannerImage,
    })
  }
}
