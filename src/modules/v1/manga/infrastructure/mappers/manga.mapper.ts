import { Manga } from '../../domain/entities/manga.entity'

/* type MangaPersistence = {
    id: string;
  originalName: string
  alternativeNames: string[]
  sinopsis: string
  chapters: number
  releaseDate: Date
  coverImage: string
  bannerImage: string
  publicationStatus: string
  rating: number
  active: boolean
  authors: string[]
  genres: string[]
  demographic: string
  createdAt: Date
  updatedAt: Date
}
 */
export class MangaMapper {
  static toPersistence(manga: Manga): any {
    return {
      originalName: manga.getOriginalName(),
      alternativeNames: manga.getAlternativeNames(),
      sinopsis: manga.getSinopsis(),
      chapters: manga.getChapters(),
      releaseDate: manga.getReleaseDate().toISOString(),
      coverImage: manga.getCoverImage(),
      bannerImage: manga.getBannerImage(),
      publicationStatus: manga.getPublicationStatus(),
      demographic: manga.getDemographic().getId(),
    }
  }
}
