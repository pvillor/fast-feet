import { OrderPhotosRepository } from '@/domain/carrier/application/repositories/order-photo-repository'
import { OrderPhoto } from '@/domain/carrier/enterprise/entities/order-photo'

export class InMemoryOrderPhotosRepository implements OrderPhotosRepository {
  public items: OrderPhoto[] = []

  async create(orderphoto: OrderPhoto) {
    this.items.push(orderphoto)
  }
}
