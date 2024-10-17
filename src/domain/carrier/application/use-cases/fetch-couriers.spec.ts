import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { makeCourier } from 'test/factories/make-courier'
import { FetchCouriersUseCase } from './fetch-couriers'

let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: FetchCouriersUseCase

describe('Fetch Courier Orders', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new FetchCouriersUseCase(inMemoryCouriersRepository)
  })

  it('should be able to fetch couriers', async () => {
    const newCourier = await makeCourier({}, new UniqueEntityId('courier-1'))
    await inMemoryCouriersRepository.create(newCourier)

    const result = await sut.execute({
      page: 1,
    })

    if (result.isRight()) {
      expect(result.value.couriers).toHaveLength(1)
    }
  })
})
