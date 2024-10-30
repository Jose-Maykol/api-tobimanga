import { z } from 'zod'

export const saveMangaDemographicSchema = z.object({
  id: z.string({
    required_error: 'demographic id es requerido',
  }),
})

export type SaveMangaDemographicDto = z.infer<typeof saveMangaDemographicSchema>
