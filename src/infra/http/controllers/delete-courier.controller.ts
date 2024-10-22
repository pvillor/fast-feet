import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { DeleteCourierUseCase } from '@/domain/carrier/application/use-cases/delete-courier'
import { AdminGuard } from '@/infra/auth/admin.guard'

const deleteCourierParamsSchema = z.object({
  courierId: z.string().uuid(),
})

const paramsValidationPipe = new ZodValidationPipe(deleteCourierParamsSchema)

type DeleteCourierParamsSchema = z.infer<typeof deleteCourierParamsSchema>

@Controller('/couriers/:courierId')
@UseGuards(AdminGuard)
export class DeleteCourierController {
  constructor(private deleteCourier: DeleteCourierUseCase) {
    //
  }

  @Delete()
  @HttpCode(204)
  async handle(@Param(paramsValidationPipe) params: DeleteCourierParamsSchema) {
    const { courierId } = params

    const result = await this.deleteCourier.execute({
      courierId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
