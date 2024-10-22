import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AdminGuard } from '@/infra/auth/admin.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateCourierUseCase } from '@/domain/carrier/application/use-cases/create-courier'
import { CourierAlreadyExistsError } from '@/domain/carrier/application/use-cases/errors/courier-already-exists-error'

const createCourierBodySchema = z.object({
  name: z.string(),
  cpf: z.string().length(11),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createCourierBodySchema)

type CreateCourierBodySchema = z.infer<typeof createCourierBodySchema>

@Controller('/couriers')
@UseGuards(AdminGuard)
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

    const result = await this.createCourier.execute({
      name,
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CourierAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
