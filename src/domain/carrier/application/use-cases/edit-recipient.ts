import { Either, left, right } from '@/core/either'
import { RecipientsRepository } from '../repositories/recipient-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface EditRecipientUseCaseRequest {
  recipientId: string
  name: string
  address: string
}

type EditRecipientUseCaseResponse = Either<ResourceNotFoundError, object>

export class EditRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {
    //
  }

  async execute({
    recipientId,
    name,
    address,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    recipient.name = name
    recipient.address = address

    await this.recipientsRepository.save(recipient)

    return right({})
  }
}
