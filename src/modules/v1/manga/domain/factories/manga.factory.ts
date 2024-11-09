import { Manga } from '../entities/manga.entity'

type MangaProps = {
  originalName: string
  alternativeNames?: string[]
  sinopsis: string
  chapters: number
  releaseDate: Date
  publicationStatus: string
  coverImage: string
  bannerImage: string
}

export class MangaFactory {
  create(manga: MangaProps): any {
    return new Manga({
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
