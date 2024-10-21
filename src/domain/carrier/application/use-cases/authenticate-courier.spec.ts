import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { AuthenticateCourierUseCase } from './authenticate-courier'
import { makeCourier } from 'test/factories/make-courier'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'

let inMemoryCouriersRepository: InMemoryCouriersRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateCourierUseCase

describe('Authenticate Courier', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateCourierUseCase(
      inMemoryCouriersRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate as courier', async () => {
    const newCourier = makeCourier(
      {
        cpf: '00000000000',
        password: await fakeHasher.hash('1234'),
      },
      new UniqueEntityId('courier-1'),
    )

    inMemoryCouriersRepository.create(newCourier)

    const result = await sut.execute({
      cpf: '00000000000',
      password: '1234',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value).toEqual({
        accessToken: expect.any(String),
      })
    }
  })
})
