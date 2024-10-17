import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { makeOrder } from 'test/factories/make-order'
import { DeleteOrderUseCase } from './delete-order'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: DeleteOrderUseCase

describe('Delete Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    sut = new DeleteOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to delete a order', async () => {
    const newOrder = makeOrder({}, new UniqueEntityId('order-1'))

    await inMemoryOrdersRepository.create(newOrder)

    await sut.execute({
      orderId: 'order-1',
    })

    expect(inMemoryOrdersRepository.items).toHaveLength(0)
  })
})
