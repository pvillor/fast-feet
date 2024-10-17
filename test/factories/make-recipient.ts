import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Recipient,
  RecipientProps,
} from '@/domain/carrier/enterprise/entities/recipient'
import { faker } from '@faker-js/faker'

export function makeRecipient(
  override: Partial<RecipientProps>,
  id?: UniqueEntityId,
) {
  const recipient = Recipient.create(
    {
      name: faker.person.fullName(),
      address: faker.location.streetAddress({ useFullAddress: true }),
      ...override,
    },
    id,
  )

  return recipient
}
