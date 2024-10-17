import { CouriersRepository } from '@/domain/carrier/application/repositories/courier-repository'
import { Courier } from '@/domain/carrier/enterprise/entities/courier'

export class InMemoryCouriersRepository implements CouriersRepository {
  public items: Courier[] = []

  async findById(id: string) {
    const courier = this.items.find((item) => item.id.toString() === id)

    if (!courier) {
      return null
    }

    return courier
  }

  async findByCpf(cpf: string) {
    const courier = this.items.find((item) => item.cpf === cpf)

    if (!courier) {
      return null
    }

    return courier
  }

  async save(courier: Courier) {
    const itemIndex = this.items.findIndex((item) => item.id === courier.id)

    this.items[itemIndex] = courier
  }

  async create(courier: Courier) {
    this.items.push(courier)
  }

  async delete(courier: Courier) {
    const itemIndex = this.items.findIndex((item) => item.id === courier.id)

    this.items.splice(itemIndex, 1)
  }
}
