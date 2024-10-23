import { OrdersRepository } from '@/domain/carrier/application/repositories/order-repository'
import { Order } from '@/domain/carrier/enterprise/entities/order'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { DomainEvents } from '@/core/events/domain-events'
import { CacheRepository } from '@/infra/cache/cache-repository'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
  ) {
    //
  }

  async findById(id: string) {
    const cacheHit = await this.cache.get(`order:${id}:details`)

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit)

      return cachedData
    }

    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    })

    if (!order) {
      return null
    }

    const orderDetails = PrismaOrderMapper.toDomain(order)

    await this.cache.set(`order:${id}:details`, JSON.stringify(orderDetails))

    return orderDetails
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

    await this.cache.delete(`order:${data.id}:details`)

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async create(order: Order) {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({ data })

    DomainEvents.dispatchEventsForAggregate(order.id)
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
