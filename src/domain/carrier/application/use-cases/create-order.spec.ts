import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { CreateOrderUseCase } from './create-order'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: CreateOrderUseCase

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    sut = new CreateOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to create an order', async () => {
    const result = await sut.execute({
      recipientId: '1',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryOrdersRepository.items[0].id).toEqual(
        result.value.order.id,
      )
    }
  })
})
