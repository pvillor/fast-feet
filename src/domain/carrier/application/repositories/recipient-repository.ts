import { Recipient } from '../../enterprise/entities/recipient'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export abstract class RecipientsRepository {
  abstract findById(id: string): Promise<Recipient | null>
  abstract findManyNearby(params: FindManyNearbyParams): Promise<Recipient[]>
  abstract save(recipient: Recipient): Promise<void>
  abstract create(recipient: Recipient): Promise<void>
  abstract delete(recipient: Recipient): Promise<void>
}
