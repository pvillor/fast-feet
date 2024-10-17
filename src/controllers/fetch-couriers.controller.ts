import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { Role } from '@prisma/client'
import { AdminGuard } from 'src/auth/admin.guard'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/couriers')
@UseGuards(JwtAuthGuard, AdminGuard)
export class FetchCouriersController {
  constructor(private prisma: PrismaService) {
    //
  }

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const perPage = 20

    const couriers = await this.prisma.user.findMany({
      where: {
        role: Role.COURIER,
      },
      select: {
        id: true,
        name: true,
        cpf: true,
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return { couriers }
  }
}
