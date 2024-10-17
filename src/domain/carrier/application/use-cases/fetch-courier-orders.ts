import { OrdersRepository } from '../repositories/order-repository'
import { Order } from '../../enterprise/entities/order'
import { CouriersRepository } from '../repositories/courier-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface FetchCourierOrdersUseCaseRequest {
  courierId: string
}

type FetchCourierOrdersUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    orders: Order[]
  }
>

export class FetchCourierOrdersUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private ordersRepository: OrdersRepository,
  ) {
    //
  }

  async execute({
    courierId,
  }: FetchCourierOrdersUseCaseRequest): Promise<FetchCourierOrdersUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    const orders = await this.ordersRepository.findManyByCourierId(
      courier.id.toString(),
    )

    return right({ orders })
  }
}
