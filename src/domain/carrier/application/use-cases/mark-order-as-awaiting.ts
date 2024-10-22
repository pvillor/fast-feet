import { Either, left, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/order-repository'
import { OrderNotFoundError } from './errors/order-not-found-error'
import { Injectable } from '@nestjs/common'

interface MarkOrderAsAwaitingUseCaseRequest {
  orderId: string
}

type MarkOrderAsAwaitingUseCaseResponse = Either<
  OrderNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class MarkOrderAsAwaitingUseCase {
  constructor(private ordersRepository: OrdersRepository) {
    //
  }

  async execute({
    orderId,
  }: MarkOrderAsAwaitingUseCaseRequest): Promise<MarkOrderAsAwaitingUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new OrderNotFoundError())
    }

    order.release()

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
