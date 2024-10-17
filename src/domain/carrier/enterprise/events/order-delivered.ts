import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Order } from '../entities/order'

export class OrderDeliveredEvent implements DomainEvent {
  public ocurredAt: Date
  public order: Order
  public photoId: UniqueEntityId

  constructor(order: Order, photoId: UniqueEntityId) {
    this.order = order
    this.photoId = photoId
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.order.id
  }
}
