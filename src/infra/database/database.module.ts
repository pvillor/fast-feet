import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaCouriersRepository } from './prisma/repositories/prisma-couriers-repository'
import { CouriersRepository } from '@/domain/carrier/application/repositories/courier-repository'
import { RecipientsRepository } from '@/domain/carrier/application/repositories/recipient-repository'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository'
import { OrdersRepository } from '@/domain/carrier/application/repositories/order-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'
import { OrderPhotosRepository } from '@/domain/carrier/application/repositories/order-photo-repository'
import { PrismaOrderPhotosRepository } from './prisma/repositories/prisma-order-photos-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: CouriersRepository,
      useClass: PrismaCouriersRepository,
    },
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: OrderPhotosRepository,
      useClass: PrismaOrderPhotosRepository,
    },
  ],
  exports: [
    PrismaService,
    CouriersRepository,
    RecipientsRepository,
    OrdersRepository,
    OrderPhotosRepository,
  ],
})
export class DatabaseModule {
  //
}
