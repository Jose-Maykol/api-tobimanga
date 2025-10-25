import { authors } from './author.schema'
import { chapters } from './chapter.schema'
import { demographics } from './demographic.schema'
import { genres } from './genres.schema'
import { mangas } from './manga.schema'
import { mangaAuthors } from './manga-author.schema'
import { mangaGenres } from './manga-genre.schema'
import { publicationStatusEnum } from './publication-status.schema'
import { readingStatusEnum } from './reading-status.schema'
import { users } from './user.schema'
import { userChapterProgress } from './user-chapter-progress.schema'
import { userFavoriteMangas } from './user-favorite-manga.schema'
import { userMangas } from './user-manga.schema'

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
  userChapterProgress,
  userFavoriteMangas,
  userMangas,
  users,
}
