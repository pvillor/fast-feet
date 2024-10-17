import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { makeCourier } from 'test/factories/make-courier'
import { DeleteCourierUseCase } from './delete-courier'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: DeleteCourierUseCase

describe('Delete Courier', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new DeleteCourierUseCase(inMemoryCouriersRepository)
  })

  it('should be able to delete a courier', async () => {
    const newCourier = await makeCourier({}, new UniqueEntityId('courier-1'))

    await inMemoryCouriersRepository.create(newCourier)

    await sut.execute({
      courierId: 'courier-1',
    })

    expect(inMemoryCouriersRepository.items).toHaveLength(0)
  })
})
