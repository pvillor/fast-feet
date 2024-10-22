import { OrderPhoto } from '../../enterprise/entities/order-photo'

export abstract class OrderPhotosRepository {
  abstract create(orderPhoto: OrderPhoto): Promise<void>
}
