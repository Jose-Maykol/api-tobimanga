import { z } from 'zod'

export const saveMangaGenresSchema = z.object({
  id: z.array(
    z.string({
      required_error: 'genre id es requerido',
    }),
  ),
})

export type SaveMangaGenresDto = z.infer<typeof saveMangaGenresSchema>
