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
import { DeleteRecipientUseCase } from '@/domain/carrier/application/use-cases/delete-recipient'
import { AdminGuard } from '@/infra/auth/admin.guard'

const deleteRecipientParamsSchema = z.object({
  recipientId: z.string().uuid(),
})

const paramsValidationPipe = new ZodValidationPipe(deleteRecipientParamsSchema)

type DeleteRecipientParamsSchema = z.infer<typeof deleteRecipientParamsSchema>

@Controller('/recipients/:recipientId')
@UseGuards(AdminGuard)
export class DeleteRecipientController {
  constructor(private deleteRecipient: DeleteRecipientUseCase) {
    //
  }

  @Delete()
  @HttpCode(204)
  async handle(
    @Param(paramsValidationPipe) params: DeleteRecipientParamsSchema,
  ) {
    const { recipientId } = params

    const result = await this.deleteRecipient.execute({
      recipientId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
