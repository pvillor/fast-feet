import { Either, left, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/order-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CouriersRepository } from '../repositories/courier-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { OrderPhoto } from '../../enterprise/entities/order-photo'

interface MarkOrderAsDeliveredUseCaseRequest {
  orderId: string
  courierId: string
  photoTitle: string
  photoLink: string
}

type MarkOrderAsDeliveredUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

export class MarkOrderAsDeliveredUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private couriersRepository: CouriersRepository,
  ) {
    //
  }

  async execute({
    orderId,
    courierId,
    photoTitle,
    photoLink,
  }: MarkOrderAsDeliveredUseCaseRequest): Promise<MarkOrderAsDeliveredUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    if (order.courierId?.toString() !== courierId) {
      return left(new NotAllowedError())
    }

    const photo = OrderPhoto.create({
      title: photoTitle,
      link: photoLink,
      orderId: order.id,
    })

    order.deliver(photo.id)

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
