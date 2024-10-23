import { OrdersRepository } from '@/domain/carrier/application/repositories/order-repository'
import { AppModule } from '@/infra/app.module'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { CacheModule } from '@/infra/cache/cache.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Prisma Orders Repository (E2E)', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let cacheRepository: CacheRepository
  let ordersRepository: OrdersRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)
    cacheRepository = moduleRef.get(CacheRepository)
    ordersRepository = moduleRef.get(OrdersRepository)

    await app.init()
  })

  it('should cache order details', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    })

    const orderDetails = await ordersRepository.findById(order.id.toString())

    const cached = await cacheRepository.get(`order:${order.id}:details`)

    if (!cached) {
      throw new Error()
    }

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: orderDetails?.id.toString(),
      }),
    )
  })

  it('should return cached order details on subsequent calls', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    })

    let cached = await cacheRepository.get(`order:${order.id}:details`)

    expect(cached).toBeNull()

    await ordersRepository.findById(order.id.toString())

    cached = await cacheRepository.get(`order:${order.id}:details`)

    expect(cached).not.toBeNull()

    const orderDetails = await ordersRepository.findById(order.id.toString())

    if (!cached) {
      throw new Error()
    }

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: orderDetails?.id.toString(),
      }),
    )
  })

  it('should reset order details cache when saving the order', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    })

    await cacheRepository.set(
      `order:${order.id}:details`,
      JSON.stringify({ empty: true }),
    )

    await ordersRepository.save(order)

    const cached = await cacheRepository.get(`order:${order.id}:details`)

    expect(cached).toBeNull()
  })
})
