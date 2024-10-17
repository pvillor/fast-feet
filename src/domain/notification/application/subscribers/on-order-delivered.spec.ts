import { makeOrder } from 'test/factories/make-order'
import { OnOrderDelivered } from './on-order-delivered'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { MockInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Order Delivered', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    // eslint-disable-next-line no-new
    new OnOrderDelivered(sendNotificationUseCase)
  })

  it('should send a notification when an order is delivered', async () => {
    const order = makeOrder({
      photoId: new UniqueEntityId('photo-1'),
    })

    inMemoryOrdersRepository.create(order)

    if (order.photoId) {
      order.deliver(order.photoId)
    }

    inMemoryOrdersRepository.save(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
