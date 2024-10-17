import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaCouriersRepository } from './prisma/repositories/prisma-couriers-repository'
import { CouriersRepository } from '@/domain/carrier/application/repositories/courier-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: CouriersRepository,
      useClass: PrismaCouriersRepository,
    },
    // PrismaOrdersRepository,
    // PrismaRecipientsRepository,
  ],
  exports: [
    PrismaService,
    CouriersRepository,
    // PrismaOrdersRepository,
    // PrismaRecipientsRepository,
  ],
})
export class DatabaseModule {
  //
}
