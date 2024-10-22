import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AdminGuard } from '@/infra/auth/admin.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateOrderUseCase } from '@/domain/carrier/application/use-cases/create-order'
import { RecipientNotFoundError } from '@/domain/carrier/application/use-cases/errors/recipient-not-found-error'

const createOrderBodySchema = z.object({
  recipientId: z.string().uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(createOrderBodySchema)

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>

@Controller('/orders')
@UseGuards(AdminGuard)
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {
    //
  }

  @Post()
  async handle(
    @Body(bodyValidationPipe)
    body: CreateOrderBodySchema,
  ) {
    const { recipientId } = body

    const result = await this.createOrder.execute({
      recipientId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case RecipientNotFoundError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
