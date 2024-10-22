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
import { MarkOrderAsReturnedUseCase } from '@/domain/carrier/application/use-cases/mark-order-as-returned'

const markOrderAsReturnedParamsSchema = z.object({
  orderId: z.string().uuid(),
})

const paramsValidationPipe = new ZodValidationPipe(
  markOrderAsReturnedParamsSchema,
)

type MarkOrderAsReturnedParamsSchema = z.infer<
  typeof markOrderAsReturnedParamsSchema
>

@Controller('/orders/:orderId/returned')
@UseGuards(AdminGuard)
export class MarkOrderAsReturnedController {
  constructor(private markOrderAsReturned: MarkOrderAsReturnedUseCase) {
    //
  }

  @Patch()
  @HttpCode(204)
  async handle(
    @Param(paramsValidationPipe) params: MarkOrderAsReturnedParamsSchema,
  ) {
    const { orderId } = params

    const result = await this.markOrderAsReturned.execute({
      orderId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
