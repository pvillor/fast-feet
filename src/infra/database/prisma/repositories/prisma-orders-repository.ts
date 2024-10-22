import { OrdersRepository } from '@/domain/carrier/application/repositories/order-repository'
import { Order } from '@/domain/carrier/enterprise/entities/order'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {
    //
  }

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    })

    if (!order) {
      return null
    }

    return PrismaOrderMapper.toDomain(order)
  }

  async findManyByCourierId(courierId: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        courierId,
      },
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findManyByRecipientIds(recipientIds: string[]) {
    const orders = await this.prisma.order.findMany({
      where: {
        recipientId: {
          in: recipientIds,
        },
      },
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async save(order: Order) {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(order: Order) {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({ data })
  }

  async delete(order: Order) {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.delete({
      where: {
        id: data.id,
      },
    })
  }
}
