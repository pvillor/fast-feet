import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AdminGuard } from '@/infra/auth/admin.guard'
import { GetOrderUseCase } from '@/domain/carrier/application/use-cases/get-order'
import { OrderPresenter } from '../presenters/order-presenter'

const getOrderParamsSchema = z.object({
  orderId: z.string().uuid(),
})

const paramsValidationPipe = new ZodValidationPipe(getOrderParamsSchema)

type GetOrderParamsSchema = z.infer<typeof getOrderParamsSchema>

@Controller('/orders/:orderId')
@UseGuards(AdminGuard)
export class GetOrderController {
  constructor(private getOrder: GetOrderUseCase) {
    //
  }

  @Get()
  async handle(@Param(paramsValidationPipe) params: GetOrderParamsSchema) {
    const { orderId } = params

    const result = await this.getOrder.execute({
      orderId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { order } = result.value

    return { order: OrderPresenter.toHTTP(order) }
  }
}
