import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchOrdersNearbyCourierLocationUseCase } from './fetch-orders-nearby-courier-location'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import {
  OrderStatus,
  Status,
} from '../../enterprise/entities/value-objects/order-status'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: FetchOrdersNearbyCourierLocationUseCase

describe('Fetch Orders Nearby Courier Location', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    sut = new FetchOrdersNearbyCourierLocationUseCase(
      inMemoryRecipientsRepository,
      inMemoryOrdersRepository,
    )
  })

  it('should be able to fetch orders nearby courier location', async () => {
    const newRecipient = makeRecipient(
      {
        latitude: -3.1059579,
        longitude: -59.967828,
      },
      new UniqueEntityId('recipient-1'),
    )
    const newRecipient2 = makeRecipient(
      {
        latitude: -3.114614,
        longitude: -59.9654248,
      },
      new UniqueEntityId('recipient-2'),
    )

    await inMemoryRecipientsRepository.create(newRecipient)
    await inMemoryRecipientsRepository.create(newRecipient2)

    const newOrder = makeOrder({
      recipientId: new UniqueEntityId('recipient-1'),
      status: new OrderStatus(Status.Awaiting),
    })
    const newOrder2 = makeOrder({
      recipientId: new UniqueEntityId('recipient-2'),
      status: new OrderStatus(Status.Awaiting),
    })

    await inMemoryOrdersRepository.create(newOrder)
    await inMemoryOrdersRepository.create(newOrder2)

    const result = await sut.execute({
      courierLatitude: -3.1031296,
      courierLongitude: -59.962163214,
    })

    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(2)
    }
  })
})
