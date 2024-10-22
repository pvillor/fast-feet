import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditCourierUseCase } from '@/domain/carrier/application/use-cases/edit-courier'
import { AdminGuard } from '@/infra/auth/admin.guard'

const editCourierParamsSchema = z.object({
  courierId: z.string().uuid(),
})

const paramsValidationPipe = new ZodValidationPipe(editCourierParamsSchema)

type EditCourierParamsSchema = z.infer<typeof editCourierParamsSchema>

const editCourierBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editCourierBodySchema)

type EditCourierBodySchema = z.infer<typeof editCourierBodySchema>

@Controller('/couriers/:courierId')
@UseGuards(AdminGuard)
export class EditCourierController {
  constructor(private editCourier: EditCourierUseCase) {
    //
  }

  @Put()
  @HttpCode(204)
  async handle(
    @Param(paramsValidationPipe) params: EditCourierParamsSchema,
    @Body(bodyValidationPipe) body: EditCourierBodySchema,
  ) {
    const { courierId } = params
    const { name, cpf } = body

    const result = await this.editCourier.execute({
      courierId,
      name,
      cpf,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
