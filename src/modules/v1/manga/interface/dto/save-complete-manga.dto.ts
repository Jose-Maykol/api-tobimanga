import { z } from 'zod'
import { saveMangaGenresSchema } from './save-manga-genres.dto'
import { saveMangaDemographicSchema } from './save-manga-demographic.dto'
import { saveMangaAuthorsSchema } from './save-manga-authors.dto'
import { saveMangaSchema } from './save-manga.dto'

export const saveCompleteMangaSchema = z.object({
  manga: saveMangaSchema,
  authors: saveMangaAuthorsSchema,
  demographic: saveMangaDemographicSchema,
  genres: saveMangaGenresSchema,
})

export type SaveCompleteMangaDto = z.infer<typeof saveCompleteMangaSchema>
