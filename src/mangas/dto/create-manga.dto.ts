import { z } from 'zod'

export const createMangaSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  chapters: z.number().int(),
  release_year: z.number().int(),
  image_url: z.string().url().optional(),
  finalized: z.boolean().optional(),
})

export type CreateMangaDto = z.infer<typeof createMangaSchema>
