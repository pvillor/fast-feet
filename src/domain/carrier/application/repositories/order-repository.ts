import { Order } from '../../enterprise/entities/order'

export interface OrdersRepository {
  findById(id: string): Promise<Order | null>
  findManyByCourierId(courierId: string): Promise<Order[]>
  save(order: Order): Promise<void>
  create(order: Order): Promise<void>
  delete(order: Order): Promise<void>
}
