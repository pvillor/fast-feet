import { CanActivate, ExecutionContext } from '@nestjs/common'
import { UserPayload } from './jwt-strategy'
import { Role } from '@prisma/client'

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const { role } = request.user as UserPayload

    return role === Role.ADMIN
  }
}
