import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Courier } from '@/domain/carrier/enterprise/entities/courier'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaCourierMapper {
  static toDomain(raw: PrismaUser): Courier {
    return Courier.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        password: raw.password,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(courier: Courier): Prisma.UserUncheckedCreateInput {
    return {
      id: courier.id.toString(),
      name: courier.name,
      cpf: courier.cpf,
      password: courier.password,
    }
  }
}