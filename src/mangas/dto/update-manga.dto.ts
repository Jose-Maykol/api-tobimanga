import { createMangaSchema } from './create-manga.dto'
import { z } from 'zod'

export const updateMangaSchema = createMangaSchema.omit({ image_url: true })

export type UpdateMangaDto = z.infer<typeof updateMangaSchema>
