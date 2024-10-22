import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { EditRecipientUseCase } from './edit-recipient'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: EditRecipientUseCase

describe('Edit Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new EditRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to edit a recipient', async () => {
    const newRecipient = makeRecipient({}, new UniqueEntityId('recipient-1'))

    await inMemoryRecipientsRepository.create(newRecipient)

    await sut.execute({
      recipientId: 'recipient-1',
      name: 'John Doe',
      latitude: 0.0,
      longitude: 0.0,
    })

    expect(inMemoryRecipientsRepository.items[0]).toMatchObject({
      name: 'John Doe',
      latitude: 0.0,
      longitude: 0.0,
    })
  })
})
