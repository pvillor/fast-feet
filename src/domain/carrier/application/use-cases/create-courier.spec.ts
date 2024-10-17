import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { CreateCourierUseCase } from './create-courier'

let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: CreateCourierUseCase

describe('Create Courier', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new CreateCourierUseCase(inMemoryCouriersRepository)
  })

  it('should be able to create a courier', async () => {
    const successResult = await sut.execute({
      name: 'John Doe',
      cpf: '00000000000',
      password: '1234',
    })

    expect(successResult.isRight()).toBe(true)
    if (successResult.isRight()) {
      expect(inMemoryCouriersRepository.items[0].id).toEqual(
        successResult.value.courier.id,
      )
    }
  })
})
