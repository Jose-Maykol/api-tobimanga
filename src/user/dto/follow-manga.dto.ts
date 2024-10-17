import { z } from 'zod'

export const followMangaSchema = z.object({
  manga: z.object(
    {
      id: z.string({
        message: 'El id del manga debe ser un string',
        required_error: 'El id del manga es requerido',
      }),
    },
    {
      message: 'El manga debe ser un objeto',
      required_error: 'El manga es requerido',
    },
  ),
})

export type FollowMangaDto = z.input<typeof followMangaSchema>
