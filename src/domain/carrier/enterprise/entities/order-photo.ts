import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface OrderPhotoProps {
  orderId: UniqueEntityId
  title: string
  url: string
}

export class OrderPhoto extends Entity<OrderPhotoProps> {
  get title() {
    return this.props.title
  }

  get url() {
    return this.props.url
  }

  get orderId() {
    return this.props.orderId
  }

  static create(props: OrderPhotoProps, id?: UniqueEntityId) {
    const orderPhoto = new OrderPhoto(props, id)

    return orderPhoto
  }
}
