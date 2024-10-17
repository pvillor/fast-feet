import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchCourierOrdersUseCase } from './fetch-courier-orders'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { makeCourier } from 'test/factories/make-courier'

let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: FetchCourierOrdersUseCase

describe('Fetch Courier Orders', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    sut = new FetchCourierOrdersUseCase(
      inMemoryCouriersRepository,
      inMemoryOrdersRepository,
    )
  })

  it('should be able to fetch a courier orders', async () => {
    const newCourier = await makeCourier({}, new UniqueEntityId('courier-1'))
    await inMemoryCouriersRepository.create(newCourier)

    const newOrder = makeOrder({
      courierId: new UniqueEntityId('courier-1'),
    })
    const newOrder2 = makeOrder({
      courierId: new UniqueEntityId('courier-2'),
    })

    await inMemoryOrdersRepository.create(newOrder)
    await inMemoryOrdersRepository.create(newOrder2)

    const result = await sut.execute({
      courierId: 'courier-1',
    })

    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(1)
    }
  })
})
