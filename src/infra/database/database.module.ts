import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaCouriersRepository } from './prisma/repositories/prisma-couriers-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository'

@Module({
  providers: [
    PrismaService,
    PrismaCouriersRepository,
    PrismaOrdersRepository,
    PrismaRecipientsRepository,
  ],
  exports: [
    PrismaService,
    PrismaCouriersRepository,
    PrismaOrdersRepository,
    PrismaRecipientsRepository,
  ],
})
export class DatabaseModule {
  //
}
