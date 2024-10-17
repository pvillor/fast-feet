import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Courier,
  CourierProps,
} from '@/domain/carrier/enterprise/entities/courier'
import { faker } from '@faker-js/faker'

export function makeCourier(
  override: Partial<CourierProps> = {},
  id?: UniqueEntityId,
) {
  const courier = Courier.create(
    {
      name: faker.person.fullName(),
      cpf: String(faker.number.int({ min: 10000000000, max: 99999999999 })),
      passwordHash: faker.internet.password(),
      ...override,
    },
    id,
  )

  return courier
}
