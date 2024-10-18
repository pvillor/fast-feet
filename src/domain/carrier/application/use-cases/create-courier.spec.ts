import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { CreateCourierUseCase } from './create-courier'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryCouriersRepository: InMemoryCouriersRepository
let fakeHasher: FakeHasher
let sut: CreateCourierUseCase

describe('Create Courier', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateCourierUseCase(inMemoryCouriersRepository, fakeHasher)
  })

  it('should be able to create a courier', async () => {
    const successResult = await sut.execute({
      name: 'John Doe',
      cpf: '00000000000',
      password: await fakeHasher.hash('1234'),
    })

    expect(successResult.isRight()).toBe(true)
    if (successResult.isRight()) {
      expect(successResult.value).toEqual({
        courier: inMemoryCouriersRepository.items[0],
      })
    }
  })
})
