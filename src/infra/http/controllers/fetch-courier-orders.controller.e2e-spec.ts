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

describe('Fetch courier orders (E2E)', () => {
  let app: INestApplication
  let courierFactory: CourierFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OrderFactory, CourierFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    orderFactory = moduleRef.get(OrderFactory)
    courierFactory = moduleRef.get(CourierFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /couriers/:courierId/orders', async () => {
    const courier = await courierFactory.makePrismaCourier({})
    const recipient = await recipientFactory.makePrismaRecipient({})

    const accessToken = jwt.sign({
      sub: courier.id.toString(),
      role: Role.COURIER,
    })

    await orderFactory.makePrismaOrder({
      courierId: courier.id,
      recipientId: recipient.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/couriers/${courier.id}/orders`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.orders).toHaveLength(1)
  })
})
