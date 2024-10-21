import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Recipient } from '@/domain/carrier/enterprise/entities/recipient'
import { Prisma, Recipient as PrismaRecipient } from '@prisma/client'

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        latitude: raw.latitude.toNumber(),
        longitude: raw.longitude.toNumber(),
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      latitude: recipient.latitude,
      longitude: recipient.longitude,
    }
  }
}
