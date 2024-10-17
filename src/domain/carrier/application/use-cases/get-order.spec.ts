import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { GetOrderUseCase } from './get-order'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: GetOrderUseCase

describe('Get Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    sut = new GetOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to get a order details', async () => {
    const newOrder = makeOrder({}, new UniqueEntityId('order-1'))
    await inMemoryOrdersRepository.create(newOrder)

    const result = await sut.execute({
      orderId: 'order-1',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(newOrder.id).toEqual(result.value.order.id)
      expect(result.value.order.courierId).toEqual(newOrder.courierId)
      expect(result.value.order.recipientId).toEqual(newOrder.recipientId)
    }
  })
})
