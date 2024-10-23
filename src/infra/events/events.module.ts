import { OnOrderAvailable } from '@/domain/notification/application/subscribers/on-order-available'
import { OnOrderCollected } from '@/domain/notification/application/subscribers/on-order-collected'
import { OnOrderCreated } from '@/domain/notification/application/subscribers/on-order-created'
import { OnOrderDelivered } from '@/domain/notification/application/subscribers/on-order-delivered'
import { OnOrderReturned } from '@/domain/notification/application/subscribers/on-order-returned'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnOrderCreated,
    OnOrderAvailable,
    OnOrderCollected,
    OnOrderDelivered,
    OnOrderReturned,
    SendNotificationUseCase,
  ],
})
export class EventsModule {
  //
}
