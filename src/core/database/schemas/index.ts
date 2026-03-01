import { demographicRelations } from '../relations/demographic.relations'
import { mangaRelations } from '../relations/manga.relations'
import { mangaAuthorRelations } from '../relations/manga-author.relations'
import { mangaGenreRelations } from '../relations/manga-genre.relations'
import { authors } from './author.schema'
import { chapters } from './chapter.schema'
import { cronJobs } from './cron-job.schema'
import { cronJobExecutions } from './cron-job-execution.schema'
import { demographics } from './demographic.schema'
import { genres } from './genres.schema'
import { mangas } from './manga.schema'
import { mangaAuthors } from './manga-author.schema'
import { mangaGenres } from './manga-genre.schema'
import { publicationStatusEnum } from './publication-status.schema'
import { readingStatusEnum } from './reading-status.schema'
import { users } from './user.schema'
import { userChapterProgress } from './user-chapter-progress.schema'
import { userMangas } from './user-manga.schema'

export const databaseSchema = {
  authors,
  chapters,
  cronJobs,
  cronJobExecutions,
  demographics,
  genres,
  mangas,
  mangaAuthors,
  mangaGenres,
  userMangas,
  publicationStatusEnum,
  readingStatusEnum,
  userChapterProgress,
  users,

  mangaRelations,
  mangaAuthorRelations,
  mangaGenreRelations,
  demographicRelations,
}
