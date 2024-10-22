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
import { DeleteOrderUseCase } from '@/domain/carrier/application/use-cases/delete-order'
import { AdminGuard } from '@/infra/auth/admin.guard'

const deleteOrderParamsSchema = z.object({
  orderId: z.string().uuid(),
})

const paramsValidationPipe = new ZodValidationPipe(deleteOrderParamsSchema)

type DeleteOrderParamsSchema = z.infer<typeof deleteOrderParamsSchema>

@Controller('/orders/:orderId')
@UseGuards(AdminGuard)
export class DeleteOrderController {
  constructor(private deleteOrder: DeleteOrderUseCase) {
    //
  }

  @Delete()
  @HttpCode(204)
  async handle(@Param(paramsValidationPipe) params: DeleteOrderParamsSchema) {
    const { orderId } = params

    const result = await this.deleteOrder.execute({
      orderId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
