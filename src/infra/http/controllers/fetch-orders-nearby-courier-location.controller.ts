import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { Public } from '@/infra/auth/public'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { FetchOrdersNearbyCourierLocationUseCase } from '@/domain/carrier/application/use-cases/fetch-orders-nearby-courier-location'

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
@Public()
@UseGuards(JwtAuthGuard)
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

    return { orders }
  }
}