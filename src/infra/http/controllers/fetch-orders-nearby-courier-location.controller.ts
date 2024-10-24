import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchOrdersNearbyCourierLocationUseCase } from '@/domain/carrier/application/use-cases/fetch-orders-nearby-courier-location'
import { OrderPresenter } from '../presenters/order-presenter'

const nearbyOrdersQuerySchema = z.object({
  latitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  longitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
})

const queryValidationPipe = new ZodValidationPipe(nearbyOrdersQuerySchema)

type NearbyOrdersQuerySchema = z.infer<typeof nearbyOrdersQuerySchema>

@Controller('/orders/nearby')
export class FetchOrdersNearbyCourierLocationController {
  constructor(
    private fetchOrdersNearbyCourierLocation: FetchOrdersNearbyCourierLocationUseCase,
  ) {
    //
  }

  @Get()
  async handle(@Query(queryValidationPipe) query: NearbyOrdersQuerySchema) {
    const { latitude, longitude } = query

    const result = await this.fetchOrdersNearbyCourierLocation.execute({
      courierLatitude: latitude,
      courierLongitude: longitude,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { orders } = result.value

    return { orders: orders.map(OrderPresenter.toHTTP) }
  }
}
