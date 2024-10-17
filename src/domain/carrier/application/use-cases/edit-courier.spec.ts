import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { makeCourier } from 'test/factories/make-courier'
import { EditCourierUseCase } from './edit-courier'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: EditCourierUseCase

describe('Edit Courier', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new EditCourierUseCase(inMemoryCouriersRepository)
  })

  it('should be able to edit a courier', async () => {
    const newCourier = await makeCourier({}, new UniqueEntityId('courier-1'))

    await inMemoryCouriersRepository.create(newCourier)

    await sut.execute({
      courierId: 'courier-1',
      name: 'John Doe',
      cpf: '00000000000',
    })

    expect(inMemoryCouriersRepository.items[0]).toMatchObject({
      name: 'John Doe',
      cpf: '00000000000',
    })
  })
})
