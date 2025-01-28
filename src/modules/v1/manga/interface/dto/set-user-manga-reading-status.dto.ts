import { z } from 'zod'
import { mangaReadingStatus } from './update-user-manga-reading-status.dto'

export const setUserMangaReadingStatusSchema = z.object({
  status: mangaReadingStatus,
})

export type SetUserMangaReadingStatusDto = z.infer<
  typeof setUserMangaReadingStatusSchema
>
