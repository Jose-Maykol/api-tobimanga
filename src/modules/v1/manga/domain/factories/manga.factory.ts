import { Manga } from '../entities/manga.entity'
import { v4 as uuidv4 } from 'uuid'
import slugify from 'slugify'
import { Author } from '../entities/author.entity'
import { Genre } from '../entities/genre.entity'
import { Demographic } from '../entities/demographic.entity'

type MangaFactoryProps = {
  originalName: string
  alternativeNames?: string[]
  sinopsis: string
  chapters: number
  releaseDate: Date
  coverImage: string
  bannerImage: string
  publicationStatus: string
  authors: Author[]
  genres: Genre[]
  demographic: Demographic
}

export class MangaFactory {
  create(manga: MangaFactoryProps): Manga {
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
      originalName: manga.originalName,
      alternativeNames: manga.alternativeNames,
      sinopsis: manga.sinopsis,
      chapters: manga.chapters,
      releaseDate: manga.releaseDate,
      publicationStatus: manga.publicationStatus,
      coverImage: manga.coverImage,
      bannerImage: manga.bannerImage,
      createdAt: new Date(),
      updatedAt: undefined,
      authors: manga.authors,
      genres: manga.genres,
      demographic: manga.demographic,
    })
  }
}
