import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { Role } from '@prisma/client'
import request from 'supertest'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Create order (E2E)', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /orders', async () => {
    const admin = await prisma.user.create({
      data: {
        name: 'admin',
        cpf: '123456789100',
        password: '1234',
        role: Role.ADMIN,
      },
    })

    const accessToken = jwt.sign({ sub: admin.id, role: admin.role })

    const newRecipient = await recipientFactory.makePrismaRecipient()

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientId: newRecipient.id.toString(),
      })

    expect(response.statusCode).toBe(201)

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        recipientId: newRecipient.id.toString(),
      },
    })

    expect(orderOnDatabase).toBeTruthy()
  })
})
