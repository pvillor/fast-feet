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
import { GetCourierByCpfUseCase } from '@/domain/carrier/application/use-cases/get-courier-by-cpf'

const getCourierByCpfParamsSchema = z.object({
  cpf: z.string(),
})

const paramsValidationPipe = new ZodValidationPipe(getCourierByCpfParamsSchema)

type GetCourierByCpfParamsSchema = z.infer<typeof getCourierByCpfParamsSchema>

@Controller('/couriers/:cpf')
@UseGuards(AdminGuard)
export class GetCourierByCpfController {
  constructor(private getCourierByCpf: GetCourierByCpfUseCase) {
    //
  }

  @Get()
  async handle(
    @Param(paramsValidationPipe) params: GetCourierByCpfParamsSchema,
  ) {
    const { cpf } = params
    console.log('cpf:', cpf)

    const result = await this.getCourierByCpf.execute({
      cpf,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { courier } = result.value

    return { courier }
  }
}
