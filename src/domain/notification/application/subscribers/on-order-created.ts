import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrderCreatedEvent } from '@/domain/carrier/enterprise/events/order-created'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnOrderCreated implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewOrderNotification.bind(this),
      OrderCreatedEvent.name,
    )
  }

  private async sendNewOrderNotification({ order }: OrderCreatedEvent) {
    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: 'New order confirmed!',
      content: `Order confirmed at ${order.orderedAt.getHours()}:${order.orderedAt.getMinutes()}`,
    })
  }
}
