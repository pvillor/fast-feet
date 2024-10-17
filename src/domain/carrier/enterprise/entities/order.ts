import { AggregateRoot } from '@/core/entities/aggregate-root'
import { OrderStatus, Status } from './value-objects/order-status'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { OrderCreatedEvent } from '../events/order-created'
import { OrderAvailableEvent } from '../events/order-available'
import { OrderCollectedEvent } from '../events/order-collected'
import { OrderDeliveredEvent } from '../events/order-delivered'
import { OrderReturnedEvent } from '../events/order-returned'

export interface OrderProps {
  recipientId: UniqueEntityId
  courierId?: UniqueEntityId
  photoId?: UniqueEntityId
  status: OrderStatus
  orderedAt: Date
  availableAt?: Date
  collectedAt?: Date
  deliveredAt?: Date
}

export class Order extends AggregateRoot<OrderProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get courierId() {
    return this.props.courierId
  }

  get photoId() {
    return this.props.photoId
  }

  get status() {
    return this.props.status
  }

  get orderedAt() {
    return this.props.orderedAt
  }

  get availableAt() {
    return this.props.availableAt
  }

  release() {
    this.addDomainEvent(new OrderAvailableEvent(this))

    this.props.availableAt = new Date()
    this.props.status = new OrderStatus(Status.Awaiting)
  }

  get collectedAt() {
    return this.props.collectedAt
  }

  collect(courierId: UniqueEntityId) {
    this.addDomainEvent(new OrderCollectedEvent(this, courierId))

    this.props.courierId = courierId
    this.props.collectedAt = new Date()
    this.props.status = new OrderStatus(Status.Collected)
  }

  get deliveredAt() {
    return this.props.deliveredAt
  }

  deliver(photoId: UniqueEntityId) {
    this.addDomainEvent(new OrderDeliveredEvent(this, photoId))

    this.props.photoId = photoId
    this.props.deliveredAt = new Date()
    this.props.status = new OrderStatus(Status.Delivered)
  }

  return() {
    this.addDomainEvent(new OrderReturnedEvent(this))

    this.props.status = new OrderStatus(Status.Returned)
  }

  static create(
    props: Optional<OrderProps, 'status' | 'orderedAt' | 'courierId'>,
    id?: UniqueEntityId,
  ) {
    const order = new Order(
      {
        ...props,
        status: new OrderStatus(Status.Processing),
        orderedAt: new Date(),
      },
      id,
    )

    const isNewOrder = !id

    if (isNewOrder) {
      order.addDomainEvent(new OrderCreatedEvent(order))
    }

    return order
  }
}
