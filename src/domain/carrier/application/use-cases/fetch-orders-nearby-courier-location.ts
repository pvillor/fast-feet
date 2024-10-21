import { OrdersRepository } from '../repositories/order-repository'
import { Order } from '../../enterprise/entities/order'
import { Either, right } from '@/core/either'
import { RecipientsRepository } from '../repositories/recipient-repository'
import { Injectable } from '@nestjs/common'

interface FetchOrdersNearbyCourierLocationUseCaseRequest {
  courierLatitude: number
  courierLongitude: number
}

type FetchOrdersNearbyCourierLocationUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchOrdersNearbyCourierLocationUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private ordersRepository: OrdersRepository,
  ) {
    //
  }

  async execute({
    courierLatitude,
    courierLongitude,
  }: FetchOrdersNearbyCourierLocationUseCaseRequest): Promise<FetchOrdersNearbyCourierLocationUseCaseResponse> {
    const recipients = await this.recipientsRepository.findManyNearby({
      latitude: courierLatitude,
      longitude: courierLongitude,
    })

    const recipientIds = recipients.map((recipient) => recipient.id.toString())

    const orders =
      await this.ordersRepository.findManyByRecipientIds(recipientIds)

    return right({ orders })
  }
}
