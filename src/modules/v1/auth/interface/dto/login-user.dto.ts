import { z } from 'zod'

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type UserLoginDto = z.infer<typeof userLoginSchema>
