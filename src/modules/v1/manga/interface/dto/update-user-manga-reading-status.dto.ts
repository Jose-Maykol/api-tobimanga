/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod'

export const mangaReadingStatus = z.enum(
  ['READING', 'COMPLETED', 'DROPPED', 'PLANNING_TO_READ', 'PAUSED', 'UNKNOWN'],
  {
    errorMap: (issue, _ctx) => {
      return {
        message: 'El estado de lectura del manga es inválido',
      }
    },
  },
)

export const updateUserMangaReadingStatusSchema = z.object({
  status: mangaReadingStatus,
})

export type UpdateUserMangaReadingStatusDto = z.infer<
  typeof updateUserMangaReadingStatusSchema
>
