import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { makeCourier } from 'test/factories/make-courier'
import { ChangeCourierPasswordUseCase } from './change-courier-password'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { compare } from 'bcryptjs'

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
        passwordHash: '1234',
      },
      new UniqueEntityId('courier-1'),
    )

    await inMemoryCouriersRepository.create(newCourier)

    await sut.execute({
      courierId: 'courier-1',
      password: '12345',
    })

    expect(
      await compare('12345', inMemoryCouriersRepository.items[0].passwordHash),
    ).toEqual(true)

    expect(
      await compare('1234', inMemoryCouriersRepository.items[0].passwordHash),
    ).toEqual(false)
  })
})
