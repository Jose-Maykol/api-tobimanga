import { ROLES_KEY } from '@/interface/decorators/roles.decorator'
import { AuthenticatedUser } from '@/common/interfaces/authenticated-user.interface'
import { CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      ('USER' | 'ADMIN')[]
    >(ROLES_KEY, [context.getHandler(), context.getClass()])

    if (!requiredRoles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user: AuthenticatedUser = request.user

    return requiredRoles.includes(user.role)
  }
}
