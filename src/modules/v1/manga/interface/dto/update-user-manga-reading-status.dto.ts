/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod'
import { mangaReadingStatus } from './manga-reading-status.dto'

export const updateUserMangaReadingStatusSchema = z.object({
  status: mangaReadingStatus,
})

export type UpdateUserMangaReadingStatusDto = z.infer<
  typeof updateUserMangaReadingStatusSchema
>
