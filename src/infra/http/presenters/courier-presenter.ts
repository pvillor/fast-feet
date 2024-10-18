import { Courier } from '@/domain/carrier/enterprise/entities/courier'

export class CourierPresenter {
  static toHTTP(courier: Courier) {
    return {
      id: courier.id.toString(),
      name: courier.name,
      cpf: courier.cpf,
    }
  }
}
