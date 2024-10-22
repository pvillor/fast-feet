import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { CreateOrderUseCase } from './create-order'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: CreateOrderUseCase

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    sut = new CreateOrderUseCase(
      inMemoryRecipientsRepository,
      inMemoryOrdersRepository,
    )
  })

  it('should be able to create an order', async () => {
    const newRecipient = makeRecipient({}, new UniqueEntityId('recipient-1'))

    inMemoryRecipientsRepository.create(newRecipient)

    const result = await sut.execute({
      recipientId: 'recipient-1',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryOrdersRepository.items[0].id).toEqual(
        result.value.order.id,
      )
    }
  })
})
