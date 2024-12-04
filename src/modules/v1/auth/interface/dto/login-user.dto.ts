import { z } from 'zod'

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type LoginUserDto = z.infer<typeof loginUserSchema>
