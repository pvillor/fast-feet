import { Either, left, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/order-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface MarkOrderAsReturnedUseCaseRequest {
  orderId: string
}

type MarkOrderAsReturnedUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

export class MarkOrderAsReturnedUseCase {
  constructor(private ordersRepository: OrdersRepository) {
    //
  }

  async execute({
    orderId,
  }: MarkOrderAsReturnedUseCaseRequest): Promise<MarkOrderAsReturnedUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.return()

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
