import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const changePasswordBodySchema = z.object({
  password: z.string(),
})

type ChangePasswordBodySchema = z.infer<typeof changePasswordBodySchema>

@Controller('/accounts')
@UseGuards(JwtAuthGuard)
export class ChangePasswordController {
  constructor(private prisma: PrismaService) {
    //
  }

  @Patch(':userId/password')
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(changePasswordBodySchema))
  async handle(
    @Param() userId: string,
    @Body() body: ChangePasswordBodySchema,
  ) {
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
