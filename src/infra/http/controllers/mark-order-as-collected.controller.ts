import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AdminGuard } from '@/infra/auth/admin.guard'
import { MarkOrderAsCollectedUseCase } from '@/domain/carrier/application/use-cases/mark-order-as-collected'

const markOrderAsCollectedParamsSchema = z.object({
  orderId: z.string().uuid(),
  courierId: z.string().uuid(),
})

const paramsValidationPipe = new ZodValidationPipe(
  markOrderAsCollectedParamsSchema,
)

type MarkOrderAsCollectedParamsSchema = z.infer<
  typeof markOrderAsCollectedParamsSchema
>

@Controller('/couriers/:courierId/collect/:orderId')
@UseGuards(AdminGuard)
export class MarkOrderAsCollectedController {
  constructor(private markOrderAsCollected: MarkOrderAsCollectedUseCase) {
    //
  }

  @Patch()
  @HttpCode(204)
  async handle(
    @Param(paramsValidationPipe) params: MarkOrderAsCollectedParamsSchema,
  ) {
    const { orderId, courierId } = params

    const result = await this.markOrderAsCollected.execute({
      orderId,
      courierId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
