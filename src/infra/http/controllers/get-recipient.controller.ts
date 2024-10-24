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
import { GetRecipientUseCase } from '@/domain/carrier/application/use-cases/get-recipient'
import { RecipientPresenter } from '../presenters/recipient-presenter'

const getRecipientParamsSchema = z.object({
  recipientId: z.string().uuid(),
})

const paramsValidationPipe = new ZodValidationPipe(getRecipientParamsSchema)

type GetRecipientParamsSchema = z.infer<typeof getRecipientParamsSchema>

@Controller('/recipients/:recipientId')
@UseGuards(AdminGuard)
export class GetRecipientController {
  constructor(private getRecipient: GetRecipientUseCase) {
    //
  }

  @Get()
  async handle(@Param(paramsValidationPipe) params: GetRecipientParamsSchema) {
    const { recipientId } = params

    const result = await this.getRecipient.execute({
      recipientId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { recipient } = result.value

    return { recipient: RecipientPresenter.toHTTP(recipient) }
  }
}
