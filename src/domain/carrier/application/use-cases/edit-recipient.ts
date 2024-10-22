import { Either, left, right } from '@/core/either'
import { RecipientsRepository } from '../repositories/recipient-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface EditRecipientUseCaseRequest {
  recipientId: string
  name: string
  latitude: number
  longitude: number
}

type EditRecipientUseCaseResponse = Either<ResourceNotFoundError, object>

@Injectable()
export class EditRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {
    //
  }

  async execute({
    recipientId,
    name,
    latitude,
    longitude,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    recipient.name = name
    recipient.latitude = latitude
    recipient.longitude = longitude

    await this.recipientsRepository.save(recipient)

    return right({})
  }
}
