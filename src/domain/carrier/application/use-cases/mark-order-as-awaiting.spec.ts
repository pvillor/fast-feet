import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { MarkOrderAsAwaitingUseCase } from './mark-order-as-awaiting'
import { Status } from '../../enterprise/entities/value-objects/order-status'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: MarkOrderAsAwaitingUseCase

describe('Mark Order As Awaiting', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    sut = new MarkOrderAsAwaitingUseCase(inMemoryOrdersRepository)
  })

  it('should be able to mark an order as awaiting', async () => {
    const newOrder = makeOrder({}, new UniqueEntityId('order-1'))

    await inMemoryOrdersRepository.create(newOrder)

    const result = await sut.execute({
      orderId: newOrder.id.toValue(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.order.status.value).toEqual(Status.Awaiting)
    }
  })
})
