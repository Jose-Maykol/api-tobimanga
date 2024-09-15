import { createMangaSchema } from './create-manga.dto'
import { z } from 'zod'

export type UpdateMangaDto = z.infer<typeof createMangaSchema>
