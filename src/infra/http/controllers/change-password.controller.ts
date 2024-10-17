import { AdminGuard } from '@/infra/auth/admin.guard'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/prisma/prisma.service'
import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { z } from 'zod'

const changePasswordBodySchema = z.object({
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(changePasswordBodySchema)

type ChangePasswordBodySchema = z.infer<typeof changePasswordBodySchema>

@Controller('/accounts')
@UseGuards(JwtAuthGuard, AdminGuard)
export class ChangePasswordController {
  constructor(private prisma: PrismaService) {
    //
  }

  @Patch(':userId/password')
  @HttpCode(204)
  async handle(
    @Param() params: { userId: string },
    @Body(bodyValidationPipe)
    body: ChangePasswordBodySchema,
  ) {
    const { userId } = params
    const { password } = body

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: {
        id: user.id,
      },
    })
  }
}
