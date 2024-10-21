import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/carrier/enterprise/entities/order'
import {
  OrderStatus,
  Status,
} from '@/domain/carrier/enterprise/entities/value-objects/order-status'
import {
  Prisma,
  Order as PrismaOrder,
  OrderStatus as PrismaOrderStatus,
} from '@prisma/client'

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        recipientId: new UniqueEntityId(raw.recipientId),
        courierId: !raw.courierId ? null : new UniqueEntityId(raw.courierId),
        status: new OrderStatus(Status[raw.status]),
        orderedAt: raw.orderedAt,
        availableAt: raw.availableAt,
        collectedAt: raw.collectedAt,
        deliveredAt: raw.deliveredAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      courierId: order.courierId?.toString() || null,
      status: order.status?.value
        ? PrismaOrderStatus[order.status.value]
        : PrismaOrderStatus.PROCESSING,
      orderedAt: order.orderedAt,
      availableAt: order.availableAt,
      deliveredAt: order.deliveredAt,
      collectedAt: order.collectedAt,
    }
  }
}
