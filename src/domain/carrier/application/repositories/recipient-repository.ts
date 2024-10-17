import { Recipient } from '../../enterprise/entities/recipient'

export interface RecipientsRepository {
  findById(id: string): Promise<Recipient | null>
  save(recipient: Recipient): Promise<void>
  create(recipient: Recipient): Promise<void>
  delete(recipient: Recipient): Promise<void>
}
