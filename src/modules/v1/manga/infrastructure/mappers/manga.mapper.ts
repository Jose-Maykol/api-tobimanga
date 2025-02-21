import { mangas } from '@/modules/database/schemas/manga.schema'
import { Manga } from '../../domain/entities/manga.entity'
import MangaRecord from '../../domain/types/manga'
import { InferInsertModel } from 'drizzle-orm'
import { genres } from '@/modules/database/schemas/genres.schema'
import { authors } from '@/modules/database/schemas/author.schema'
import { Genre } from '../../domain/entities/genre.entity'
import { Author } from '../../domain/entities/author.entity'

export class MangaMapper {
  static toDomain(manga: MangaRecord): Manga {
    const newManga = new Manga({
      originalName: manga.originalName,
      alternativeNames: manga.alternativeNames,
      sinopsis: manga.sinopsis,
      chapters: manga.chapters,
      releaseDate: manga.releaseDate,
      coverImage: manga.coverImage,
      bannerImage: manga.bannerImage,
      publicationStatus: manga.publicationStatus,
      id: manga.id,
      rating: manga.rating,
      active: manga.active,
      slugName: manga.slugName,
      scrappingName: manga.scrappingName,
      createdAt: manga.createdAt,
      updatedAt: manga.updatedAt,
    })

    newManga.genres = manga.genres.map(
      (genre) =>
        new Genre({
          id: genre.id,
          name: genre.name,
          createdAt: genre.createdAt,
          updatedAt: genre.updatedAt,
        }),
    )

    newManga.authors = manga.authors.map(
      (author) =>
        new Author({
          id: author.id,
          name: author.name,
          createdAt: author.createdAt,
          updatedAt: author.updatedAt,
        }),
    )

    return newManga
  }

  static toPersistence(manga: Manga): {
    manga: InferInsertModel<typeof mangas>
    genres: InferInsertModel<typeof genres>[]
    authors: InferInsertModel<typeof authors>[]
  } {
    return {
      manga: {
        id: manga.id,
        originalName: manga.originalName,
        alternativeNames: manga.alternativeNames,
        sinopsis: manga.sinopsis,
        chapters: manga.chapters,
        releaseDate: manga.releaseDate.toISOString(),
        coverImage: manga.coverImage,
        bannerImage: manga.bannerImage,
        publicationStatus: manga.publicationStatus as any,
        rating: manga.rating,
        active: manga.active,
        slugName: manga.slugName,
        scrappingName: manga.scrappingName,
        createdAt: manga.createdAt,
        updatedAt: manga.updatedAt,
        demographicId: manga.demographic.id,
      },
      authors: manga.authors.map((author) => ({
        id: author.id,
        name: author.name,
        createdAt: author.createdAt,
        updatedAt: author.createdAt,
      })),
      genres: manga.genres.map((genre) => ({
        id: genre.id,
        name: genre.name,
        createdAt: genre.createdAt,
        updatedAt: genre.updatedAt,
      })),
    }
  }
}
