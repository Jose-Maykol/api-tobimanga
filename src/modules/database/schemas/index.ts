import { authors } from './author.schema'
import { chapters } from './chapter.schema'
import { demographics } from './demographic.schema'
import { genres } from './genres.schema'
import { mangaAuthors } from './manga-author'
import { mangaGenres } from './manga-genre.schema'
import { mangas } from './manga.schema'
import { publicationStatusEnum } from './publication-status.schema'
import { readingStatusEnum } from './reading-status.schema'
import { userChapters } from './user-chapter.schema'
import { userFavoriteMangas } from './user-favorite-manga.schema'
import { userMangas } from './user-manga.schema'
import { users } from './user.schema'

export const databaseSchema = {
  authors,
  chapters,
  demographics,
  genres,
  mangaAuthors,
  mangaGenres,
  mangas,
  publicationStatusEnum,
  readingStatusEnum,
  userChapters,
  userFavoriteMangas,
  userMangas,
  users,
}
