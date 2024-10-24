import { Order } from '@/domain/carrier/enterprise/entities/order'

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      courierId: order.courierId?.toString(),
      status: order.status?.value,
      availableAt: order.availableAt,
      collectedAt: order.collectedAt,
      deliveredAt: order.deliveredAt,
    }
  }
}
