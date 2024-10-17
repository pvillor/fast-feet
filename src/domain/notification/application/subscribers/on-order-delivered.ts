import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrderDeliveredEvent } from '@/domain/carrier/enterprise/events/order-delivered'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnOrderDelivered implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderDeliveredNotification.bind(this),
      OrderDeliveredEvent.name,
    )
  }

  private async sendOrderDeliveredNotification({ order }: OrderDeliveredEvent) {
    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: 'Order delivered!',
      content: `Your order was delivered at ${order.deliveredAt?.getHours}:${order.deliveredAt?.getMinutes}.`,
    })
  }
}
