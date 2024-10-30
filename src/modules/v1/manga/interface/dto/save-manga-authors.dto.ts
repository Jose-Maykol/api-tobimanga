import { z } from 'zod'

export const saveMangaAuthorsSchema = z.object({
  id: z.array(
    z.string({
      required_error: 'author id es requerido',
    }),
  ),
})

export type SaveMangaAuthorsDto = z.infer<typeof saveMangaAuthorsSchema>
