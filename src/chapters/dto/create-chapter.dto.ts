import { z } from 'zod'

export const createChapterSchema = z.object({
  manga_id: z.string(),
  chapter_number: z.number().int(),
  release_date: z.date().optional(),
})

export type CreateChapterDto = z.infer<typeof createChapterSchema>
