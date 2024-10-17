import { Either, left, right } from '@/core/either'
import { RecipientsRepository } from '../repositories/recipient-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface DeleteRecipientUseCaseRequest {
  recipientId: string
}

type DeleteRecipientUseCaseResponse = Either<ResourceNotFoundError, object>

export class DeleteRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {
    //
  }

  async execute({
    recipientId,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    await this.recipientsRepository.delete(recipient)

    return right({})
  }
}
