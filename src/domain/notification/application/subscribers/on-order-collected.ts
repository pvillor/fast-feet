import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrderCollectedEvent } from '@/domain/carrier/enterprise/events/order-collected'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { CouriersRepository } from '@/domain/carrier/application/repositories/courier-repository'

export class OnOrderCollected implements EventHandler {
  constructor(
    private couriersRepository: CouriersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderCollectedNotification.bind(this),
      OrderCollectedEvent.name,
    )
  }

  private async sendOrderCollectedNotification({
    order,
    courierId,
  }: OrderCollectedEvent) {
    const courier = await this.couriersRepository.findById(courierId.toString())

    if (courier) {
      await this.sendNotification.execute({
        recipientId: order.recipientId.toString(),
        title: 'Order collected!',
        content: `${courier.name} collected your order and will arrive soon.`,
      })
    }
  }
}
