import {
  Body,
  ConflictException,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { AdminGuard } from '@/auth/admin.guard'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string(),
  cpf: z.string().length(11),
  password: z.string(),
  role: z.enum(['ADMIN', 'COURIER']),
})

const bodyValidationPipe = new ZodValidationPipe(createAccountBodySchema)

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
@UseGuards(JwtAuthGuard, AdminGuard)
export class CreateAccountController {
  constructor(private prisma: PrismaService) {
    //
  }

  @Post()
  async handle(
    @Body(bodyValidationPipe)
    body: CreateAccountBodySchema,
  ) {
    const { name, cpf, password, role } = body

    const userWithSameCpf = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (userWithSameCpf) {
      throw new ConflictException('User with same CPF already exists.')
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        cpf,
        password: hashedPassword,
        role,
      },
    })
  }
}
