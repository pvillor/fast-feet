import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AdminGuard } from '@/infra/auth/admin.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateRecipientUseCase } from '@/domain/carrier/application/use-cases/create-recipient'

const createRecipientBodySchema = z.object({
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(createRecipientBodySchema)

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>

@Controller('/recipients')
@UseGuards(AdminGuard)
export class CreateRecipientController {
  constructor(private createRecipient: CreateRecipientUseCase) {
    //
  }

  @Post()
  async handle(
    @Body(bodyValidationPipe)
    body: CreateRecipientBodySchema,
  ) {
    const { name, latitude, longitude } = body

    const result = await this.createRecipient.execute({
      name,
      latitude,
      longitude,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
