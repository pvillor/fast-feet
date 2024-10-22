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
import { MarkOrderAsAwaitingUseCase } from '@/domain/carrier/application/use-cases/mark-order-as-awaiting'

const markOrderAsAwaitingParamsSchema = z.object({
  orderId: z.string().uuid(),
})

const paramsValidationPipe = new ZodValidationPipe(
  markOrderAsAwaitingParamsSchema,
)

type MarkOrderAsAwaitingParamsSchema = z.infer<
  typeof markOrderAsAwaitingParamsSchema
>

@Controller('/orders/:orderId/awaiting')
@UseGuards(AdminGuard)
export class MarkOrderAsAwaitingController {
  constructor(private markOrderAsAwaiting: MarkOrderAsAwaitingUseCase) {
    //
  }

  @Patch()
  @HttpCode(204)
  async handle(
    @Param(paramsValidationPipe) params: MarkOrderAsAwaitingParamsSchema,
  ) {
    const { orderId } = params

    const result = await this.markOrderAsAwaiting.execute({
      orderId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
