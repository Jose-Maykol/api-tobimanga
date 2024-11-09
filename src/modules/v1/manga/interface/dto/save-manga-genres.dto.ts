import { z } from 'zod'

export const saveMangaGenresSchema = z.array(
  z.object({
    id: z.string({
      required_error: 'El campo id del género es requerido',
      invalid_type_error: 'El campo id del género debe ser un string',
    }),
  }),
  {
    required_error: 'Debe proporcionar al menos un género',
    invalid_type_error: 'El campo géneros debe ser un array',
  },
)

export type SaveMangaGenresDto = z.infer<typeof saveMangaGenresSchema>
