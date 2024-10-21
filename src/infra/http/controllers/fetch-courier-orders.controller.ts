import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UnauthorizedException,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchCourierOrdersUseCase } from '@/domain/carrier/application/use-cases/fetch-courier-orders'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'

const nearbyOrdersParamsSchema = z.object({
  courierId: z.string().uuid(),
})

const paramsValidationPipe = new ZodValidationPipe(nearbyOrdersParamsSchema)

type NearbyOrdersParamsSchema = z.infer<typeof nearbyOrdersParamsSchema>

@Controller('/couriers/:courierId/orders')
export class FetchCourierOrdersController {
  constructor(private fetchCourierOrders: FetchCourierOrdersUseCase) {
    //
  }

  @Get()
  async handle(
    @Param(paramsValidationPipe) params: NearbyOrdersParamsSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { courierId } = params

    if (user.sub !== courierId) {
      throw new UnauthorizedException()
    }

    const result = await this.fetchCourierOrders.execute({
      courierId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { orders } = result.value

    return { orders }
  }
}
