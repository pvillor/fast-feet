import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { UserPayload } from './jwt-strategy'
import { Role } from '@prisma/client'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from './public'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    //
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const { role } = request.user as UserPayload

    return role === Role.ADMIN
  }
}
