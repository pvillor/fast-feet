import { Body, ConflictException, Controller, Post } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
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