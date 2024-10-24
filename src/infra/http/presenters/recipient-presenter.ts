import { Recipient } from '@/domain/carrier/enterprise/entities/recipient'

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      latitude: recipient.latitude,
      longitude: recipient.longitude,
    }
  }
}
