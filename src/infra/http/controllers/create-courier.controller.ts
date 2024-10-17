import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AdminGuard } from '@/infra/auth/admin.guard'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateCourierUseCase } from '@/domain/carrier/application/use-cases/create-courier'

const createCourierBodySchema = z.object({
  name: z.string(),
  cpf: z.string().length(11),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createCourierBodySchema)

type CreateCourierBodySchema = z.infer<typeof createCourierBodySchema>

@Controller('/couriers')
@UseGuards(JwtAuthGuard, AdminGuard)
export class CreateCourierController {
  constructor(private createCourier: CreateCourierUseCase) {
    //
  }

  @Post()
  async handle(
    @Body(bodyValidationPipe)
    body: CreateCourierBodySchema,
  ) {
    const { name, cpf, password } = body

    await this.createCourier.execute({
      name,
      cpf,
      password,
    })
  }
}
