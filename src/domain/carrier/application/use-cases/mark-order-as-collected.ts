import { Either, left, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/order-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CouriersRepository } from '../repositories/courier-repository'
import { Injectable } from '@nestjs/common'

interface MarkOrderAsCollectedUseCaseRequest {
  orderId: string
  courierId: string
}

type MarkOrderAsCollectedUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class MarkOrderAsCollectedUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private couriersRepository: CouriersRepository,
  ) {
    //
  }

  async execute({
    orderId,
    courierId,
  }: MarkOrderAsCollectedUseCaseRequest): Promise<MarkOrderAsCollectedUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    order.collect(courier.id)

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
