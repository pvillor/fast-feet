import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { MarkOrderAsCollectedUseCase } from './mark-order-as-collected'
import { Status } from '../../enterprise/entities/value-objects/order-status'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { makeCourier } from 'test/factories/make-courier'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: MarkOrderAsCollectedUseCase

describe('Mark Order As Collected', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new MarkOrderAsCollectedUseCase(
      inMemoryOrdersRepository,
      inMemoryCouriersRepository,
    )
  })

  it('should be able to mark an order as collected', async () => {
    const newCourier = await makeCourier({}, new UniqueEntityId('courier-1'))
    const newOrder = makeOrder({}, new UniqueEntityId('order-1'))

    await inMemoryCouriersRepository.create(newCourier)
    await inMemoryOrdersRepository.create(newOrder)

    const result = await sut.execute({
      courierId: newCourier.id.toString(),
      orderId: newOrder.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.order.status.value).toEqual(Status.Collected)
    }
  })
})
