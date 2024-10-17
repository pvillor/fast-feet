import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Order } from '../entities/order'

export class OrderCollectedEvent implements DomainEvent {
  public ocurredAt: Date
  public order: Order
  public courierId: UniqueEntityId

  constructor(order: Order, courierId: UniqueEntityId) {
    this.order = order
    this.courierId = courierId
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.order.id
  }
}
