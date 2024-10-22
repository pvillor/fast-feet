import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UnauthorizedException,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { FetchCourierOrdersUseCase } from '@/domain/carrier/application/use-cases/fetch-courier-orders'

const fetchCourierOrdersParamsSchema = z.object({
  courierId: z.string().uuid(),
})

const paramsValidationPipe = new ZodValidationPipe(
  fetchCourierOrdersParamsSchema,
)

type FetchCourierOrdersParamsSchema = z.infer<
  typeof fetchCourierOrdersParamsSchema
>

@Controller('/couriers/:courierId/orders')
export class FetchCourierOrdersController {
  constructor(private fetchCourierOrderss: FetchCourierOrdersUseCase) {
    //
  }

  @Get()
  async handle(
    @Param(paramsValidationPipe) params: FetchCourierOrdersParamsSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { courierId } = params

    if (user.sub !== courierId) {
      throw new UnauthorizedException()
    }

    const result = await this.fetchCourierOrderss.execute({
      courierId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { orders } = result.value

    return { orders }
  }
}
