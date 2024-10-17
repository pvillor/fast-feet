import { Injectable } from '@nestjs/common'
import { Courier } from '../../enterprise/entities/courier'
import { CouriersRepository } from '../repositories/courier-repository'
import { Either, right } from '@/core/either'

interface FetchCouriersUseCaseRequest {
  page: number
}

type FetchCouriersUseCaseResponse = Either<
  null,
  {
    couriers: Courier[]
  }
>

@Injectable()
export class FetchCouriersUseCase {
  constructor(private couriersRepository: CouriersRepository) {
    //
  }

  async execute({
    page,
  }: FetchCouriersUseCaseRequest): Promise<FetchCouriersUseCaseResponse> {
    const couriers = await this.couriersRepository.findMany({ page })

    return right({ couriers })
  }
}
