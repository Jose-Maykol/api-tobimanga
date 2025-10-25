import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { AuthenticatedUser } from '@/common/interfaces/authenticated-user.interface'

export const User = createParamDecorator(
  (data: keyof Express.User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user: AuthenticatedUser = request.user

    return data ? user?.[data] : user
  },
)
