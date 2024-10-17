import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { MarkOrderAsDeliveredUseCase } from './mark-order-as-delivered'
import { Status } from '../../enterprise/entities/value-objects/order-status'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { makeCourier } from 'test/factories/make-courier'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: MarkOrderAsDeliveredUseCase

describe('Mark Order As Delivered', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new MarkOrderAsDeliveredUseCase(
      inMemoryOrdersRepository,
      inMemoryCouriersRepository,
    )
  })

  it('should be able to mark an order as delivered', async () => {
    const newCourier = await makeCourier({}, new UniqueEntityId('courier-1'))
    const newOrder = makeOrder(
      {
        courierId: new UniqueEntityId('courier-1'),
      },
      new UniqueEntityId('order-1'),
    )

    await inMemoryCouriersRepository.create(newCourier)
    await inMemoryOrdersRepository.create(newOrder)

    const result = await sut.execute({
      orderId: newOrder.id.toString(),
      courierId: newCourier.id.toString(),
      photoLink: 'https://github.com/pvillor.png',
      photoTitle: 'Example photo title',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.order.status.value).toEqual(Status.Delivered)
    }
  })
})
