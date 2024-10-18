import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { AdminGuard } from '@/infra/auth/admin.guard'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchCouriersUseCase } from '@/domain/carrier/application/use-cases/fetch-couriers'
import { CourierPresenter } from '../presenters/courier-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/couriers')
@UseGuards(JwtAuthGuard, AdminGuard)
export class FetchCouriersController {
  constructor(private fetchCouriers: FetchCouriersUseCase) {
    //
  }

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchCouriers.execute({
      page,
    })

    if (result.isLeft()) {
      throw new Error()
    }

    const { couriers } = result.value

    return { couriers: couriers.map(CourierPresenter.toHTTP) }
  }
}
