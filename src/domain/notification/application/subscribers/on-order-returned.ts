import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrderReturnedEvent } from '@/domain/carrier/enterprise/events/order-returned'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnOrderReturned implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderReturnedNotification.bind(this),
      OrderReturnedEvent.name,
    )
  }

  private async sendOrderReturnedNotification({ order }: OrderReturnedEvent) {
    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: 'Order returned.',
      content: 'Your order was returned',
    })
  }
}
