import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface OrderPhotoProps {
  orderId: UniqueEntityId
  title: string
  link: string
}

export class OrderPhoto extends Entity<OrderPhotoProps> {
  get title() {
    return this.props.title
  }

  get link() {
    return this.props.link
  }

  static create(props: OrderPhotoProps, id?: UniqueEntityId) {
    const orderPhoto = new OrderPhoto(props, id)

    return orderPhoto
  }
}
