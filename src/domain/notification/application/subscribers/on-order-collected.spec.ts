import { makeOrder } from 'test/factories/make-order'
import { OnOrderCollected } from './on-order-collected'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { MockInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeCourier } from 'test/factories/make-courier'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Order Collected', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    // eslint-disable-next-line no-new
    new OnOrderCollected(inMemoryCouriersRepository, sendNotificationUseCase)
  })

  it('should send a notification when an order is collected', async () => {
    const courier = await makeCourier({}, new UniqueEntityId('courier-1'))

    const order = makeOrder({
      courierId: new UniqueEntityId('courier-1'),
    })

    inMemoryCouriersRepository.create(courier)
    inMemoryOrdersRepository.create(order)

    if (order.courierId) {
      order.collect(order.courierId)
    }

    inMemoryOrdersRepository.save(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
