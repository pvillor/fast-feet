import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { GetRecipientUseCase } from './get-recipient'
import { makeRecipient } from 'test/factories/make-recipient'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: GetRecipientUseCase

describe('Get Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new GetRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to get a recipient details', async () => {
    const newRecipient = makeRecipient({}, new UniqueEntityId('recipient-1'))

    await inMemoryRecipientsRepository.create(newRecipient)

    const result = await sut.execute({
      recipientId: 'recipient-1',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(newRecipient.id).toEqual(result.value.recipient.id)
      expect(result.value.recipient.name).toEqual(newRecipient.name)
    }
  })
})
