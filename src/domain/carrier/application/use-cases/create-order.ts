import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { OrdersRepository } from '../repositories/order-repository'

import { Order } from '../../enterprise/entities/order'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { RecipientNotFoundError } from './errors/recipient-not-found-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { RecipientsRepository } from '../repositories/recipient-repository'

interface CreateOrderUseCaseRequest {
  recipientId: string
}

type CreateOrderUseCaseResponse = Either<
  RecipientNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private ordersRepository: OrdersRepository,
  ) {
    //
  }

  async execute({
    recipientId,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    const order = Order.create({
      recipientId: new UniqueEntityId(recipientId),
    })

    await this.ordersRepository.create(order)

    return right({ order })
  }
}
