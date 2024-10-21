import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { CreateRecipientUseCase } from './create-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: CreateRecipientUseCase

describe('Create Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    sut = new CreateRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to create a recipient', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      latitude: 0.0,
      longitude: 0.0,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryRecipientsRepository.items[0].id).toEqual(
        result.value.recipient.id,
      )
    }
  })
})
