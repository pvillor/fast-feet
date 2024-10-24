import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Courier,
  CourierProps,
  Role,
} from '@/domain/carrier/enterprise/entities/courier'
import { PrismaCourierMapper } from '@/infra/database/prisma/mappers/prisma-courier-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeCourier(
  override: Partial<CourierProps> = {},
  id?: UniqueEntityId,
) {
  const courier = Courier.create(
    {
      name: faker.person.fullName(),
      cpf: String(faker.number.int({ min: 10000000000, max: 99999999999 })),
      password: faker.internet.password(),
      role: Role.COURIER,
      ...override,
    },
    id,
  )

  return courier
}

@Injectable()
export class CourierFactory {
  constructor(private prisma: PrismaService) {
    //
  }

  async makePrismaCourier(data: Partial<CourierProps> = {}): Promise<Courier> {
    const courier = makeCourier(data)

    await this.prisma.user.create({
      data: PrismaCourierMapper.toPrisma(courier),
    })

    return courier
  }
}
