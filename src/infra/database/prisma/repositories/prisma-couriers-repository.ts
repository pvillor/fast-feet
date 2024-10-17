import { CouriersRepository } from '@/domain/carrier/application/repositories/courier-repository'
import { Courier } from '@/domain/carrier/enterprise/entities/courier'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaCourierMapper } from '../mappers/prisma-courier-mapper'

@Injectable()
export class PrismaCouriersRepository implements CouriersRepository {
  constructor(private prisma: PrismaService) {
    //
  }

  async findById(id: string) {
    const courier = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!courier) {
      return null
    }

    return PrismaCourierMapper.toDomain(courier)
  }

  async findByCpf(cpf: string) {
    const courier = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (!courier) {
      return null
    }

    return PrismaCourierMapper.toDomain(courier)
  }

  async save(courier: Courier) {
    const data = PrismaCourierMapper.toPrisma(courier)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(courier: Courier) {
    const data = PrismaCourierMapper.toPrisma(courier)

    await this.prisma.user.create({
      data,
    })
  }

  async delete(courier: Courier) {
    const data = PrismaCourierMapper.toPrisma(courier)

    await this.prisma.user.delete({
      where: {
        id: data.id,
      },
    })
  }
}
