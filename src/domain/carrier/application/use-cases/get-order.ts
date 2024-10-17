import { OrdersRepository } from '../repositories/order-repository'
import { Order } from '../../enterprise/entities/order'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface GetOrderUseCaseRequest {
  orderId: string
}

type GetOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

export class GetOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {
    //
  }

  async execute({
    orderId,
  }: GetOrderUseCaseRequest): Promise<GetOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    return right({ order })
  }
}
