import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { Role } from '@/common/constants/roles.const'
import { AuthenticatedUser } from '@/common/interfaces/authenticated-user.interface'
import { ROLES_KEY } from '@/modules/auth/interface/decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user: AuthenticatedUser = request.user

    console.warn(request.user)

    return !!user && requiredRoles.includes(user.role)
  }
}
