import { RecipientsRepository } from '../repositories/recipient-repository'
import { Recipient } from '../../enterprise/entities/recipient'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface CreateRecipientUseCaseRequest {
  name: string
  latitude: number
  longitude: number
}

type CreateRecipientUseCaseResponse = Either<
  null,
  {
    recipient: Recipient
  }
>

@Injectable()
export class CreateRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {
    //
  }

  async execute({
    name,
    latitude,
    longitude,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const recipient = Recipient.create({
      name,
      latitude,
      longitude,
    })

    await this.recipientsRepository.create(recipient)

    return right({ recipient })
  }
}
