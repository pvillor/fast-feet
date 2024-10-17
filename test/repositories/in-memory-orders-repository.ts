import { DomainEvents } from '@/core/events/domain-events'
import { OrdersRepository } from '@/domain/carrier/application/repositories/order-repository'
import { Order } from '@/domain/carrier/enterprise/entities/order'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async findManyByCourierId(courierId: string) {
    if (!courierId) {
      return []
    }

    const orders = this.items.filter(
      (item) => item.courierId?.toString() === courierId,
    )

    return orders
  }

  async save(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items[itemIndex] = order

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async create(order: Order) {
    this.items.push(order)

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async delete(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items.splice(itemIndex, 1)
  }
}
