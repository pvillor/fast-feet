import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { makeCourier } from 'test/factories/make-courier'
import { ChangeCourierPasswordUseCase } from './change-courier-password'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: ChangeCourierPasswordUseCase

describe('Change Courier Password', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new ChangeCourierPasswordUseCase(inMemoryCouriersRepository)
  })

  it('should be able to change a courier password', async () => {
    const newCourier = await makeCourier(
      {
        password: '1234',
      },
      new UniqueEntityId('courier-1'),
    )

    await inMemoryCouriersRepository.create(newCourier)

    const result = await sut.execute({
      courierId: 'courier-1',
      password: '12345',
    })

    if (result.isRight()) {
      await inMemoryCouriersRepository.save(result.value.courier)
    }

    expect(inMemoryCouriersRepository.items[0].password).not.toEqual('1234')
  })
})
