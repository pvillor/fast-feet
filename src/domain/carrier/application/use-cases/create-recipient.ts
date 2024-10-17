import { RecipientsRepository } from '../repositories/recipient-repository'
import { Recipient } from '../../enterprise/entities/recipient'
import { Either, right } from '@/core/either'

interface CreateRecipientUseCaseRequest {
  name: string
  address: string
}

type CreateRecipientUseCaseResponse = Either<
  null,
  {
    recipient: Recipient
  }
>

export class CreateRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {
    //
  }

  async execute({
    name,
    address,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const recipient = Recipient.create({
      name,
      address,
    })

    await this.recipientsRepository.create(recipient)

    return right({ recipient })
  }
}
