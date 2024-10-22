import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditRecipientUseCase } from '@/domain/carrier/application/use-cases/edit-recipient'
import { AdminGuard } from '@/infra/auth/admin.guard'

const editRecipientParamsSchema = z.object({
  recipientId: z.string().uuid(),
})

const paramsValidationPipe = new ZodValidationPipe(editRecipientParamsSchema)

type EditRecipientParamsSchema = z.infer<typeof editRecipientParamsSchema>

const editRecipientBodySchema = z.object({
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(editRecipientBodySchema)

type EditRecipientBodySchema = z.infer<typeof editRecipientBodySchema>

@Controller('/recipients/:recipientId')
@UseGuards(AdminGuard)
export class EditRecipientController {
  constructor(private editRecipient: EditRecipientUseCase) {
    //
  }

  @Put()
  @HttpCode(204)
  async handle(
    @Param(paramsValidationPipe) params: EditRecipientParamsSchema,
    @Body(bodyValidationPipe) body: EditRecipientBodySchema,
  ) {
    const { recipientId } = params
    const { name, latitude, longitude } = body

    const result = await this.editRecipient.execute({
      recipientId,
      name,
      latitude,
      longitude,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
