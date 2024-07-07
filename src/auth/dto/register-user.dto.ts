import { z } from 'zod'

export const registerUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  email: z.string().email(),
})

export type RegisterUserDto = z.infer<typeof registerUserSchema>
