import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { DeleteRecipientUseCase } from './delete-recipient'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: DeleteRecipientUseCase

describe('Delete Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new DeleteRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to delete a recipient', async () => {
    const newRecipient = makeRecipient({}, new UniqueEntityId('recipient-1'))

    await inMemoryRecipientsRepository.create(newRecipient)

    await sut.execute({
      recipientId: 'recipient-1',
    })

    expect(inMemoryRecipientsRepository.items).toHaveLength(0)
  })
})
