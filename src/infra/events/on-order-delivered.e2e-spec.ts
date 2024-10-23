import { DomainEvents } from '@/core/events/domain-events'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { Role } from '@prisma/client'
import request from 'supertest'
import { CourierFactory } from 'test/factories/make-courier'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'
import { waitFor } from 'test/utils/wait-for'
import { PrismaService } from '../database/prisma/prisma.service'

describe('On order delivered', () => {
  let app: INestApplication
  let courierFactory: CourierFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    courierFactory = moduleRef.get(CourierFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)
    jwt = moduleRef.get(JwtService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification on order delivered', async () => {
    const courier = await courierFactory.makePrismaCourier()

    const accessToken = jwt.sign({
      sub: courier.id.toString(),
      role: Role.COURIER,
    })

    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      courierId: courier.id,
    })

    await request(app.getHttpServer())
      .patch(`/couriers/${courier.id}/deliver/${order.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/ore.jpg')

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: recipient.id.toString(),
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
