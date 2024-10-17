import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrderAvailableEvent } from '@/domain/carrier/enterprise/events/order-available'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnOrderAvailable implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderAvailableNotification.bind(this),
      OrderAvailableEvent.name,
    )
  }

  private async sendOrderAvailableNotification({ order }: OrderAvailableEvent) {
    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: 'Order available for pickup!',
      content: 'A courier will pickup your order soon.',
    })
  }
}
